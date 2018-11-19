import { Fork } from "../types";

var Ap = Array.prototype;
var slice = Ap.slice;
var Op = Object.prototype;
var objToStr = Op.toString;
var funObjStr = objToStr.call(function(){});
var strObjStr = objToStr.call("");
var hasOwn = Op.hasOwnProperty;

// We have to use a namespace to export types along with `export =`
// See https://github.com/Microsoft/TypeScript/issues/2719
namespace typesPlugin {
    export type CheckFn = (value: any, deep: any) => any;
    export type NameType = string | (() => string);

    export interface TypeType {
        name: NameType;
        check(value: any, deep?: any): boolean;
        assert(value: any, deep?: any): boolean;
        arrayOf(): TypeType;
        toString(): string;
    }

    export interface TypeConstructor {
        new(check: CheckFn, name: NameType): TypeType;
        fromArray(...args: any[]): TypeType;
        fromObject(obj: object): TypeType;
        or(...types: any[]): TypeType;
        def(typeName: any): any;
    }

    export interface DefType {
        typeName: string;
        baseNames: any[];
        ownFields: any;
        allSupertypes: any;
        supertypeList: any[];
        allFields: any;
        fieldNames: any;
        type: TypeType;
        isSupertypeOf(that: any): any;
        checkAllFields(value: any, deep?: any): boolean;
        check(value: any, deep?: any): boolean;
        bases(...args: any[]): this;
        buildable: boolean;
        buildParams: any;
        build(...args: any[]): this;
        field(name: string, type: any, defaultFn?: Function, hidden?: boolean): this;
        finalized: boolean;
        finalize(): void;
    }

    export interface DefConstructor {
        new(typeName: string): DefType;
        fromValue(value: any): any;
    }

    export interface FieldType {
        name: string;
        type: any;
        hidden: boolean;
        defaultFn?: Function;
        toString(): string;
        getValue(obj: { [name: string]: unknown }): any;
    }

    export interface FieldConstructor {
        new(name: string, type: any, defaultFn?: Function, hidden?: boolean): FieldType;
    }
}

import CheckFn = typesPlugin.CheckFn;
import NameType = typesPlugin.NameType;
import TypeType = typesPlugin.TypeType;
import TypeConstructor = typesPlugin.TypeConstructor;
import DefType = typesPlugin.DefType;
import DefConstructor = typesPlugin.DefConstructor;
import FieldType = typesPlugin.FieldType;
import FieldConstructor = typesPlugin.FieldConstructor;

type NameStringCheck = (name: NameType) => name is string;
type NameFnCheck = (name: NameType) => name is (() => string);

function typesPlugin(_fork: Fork) {
    // A type is an object with a .check method that takes a value and returns
    // true or false according to whether the value matches the type.

    const Type = function Type(this: TypeType, check: CheckFn, name: NameType) {
        var self = this;
        if (!(self instanceof Type)) {
            throw new Error("Type constructor cannot be invoked without 'new'");
        }

        // Unfortunately we can't elegantly reuse isFunction and isString,
        // here, because this code is executed while defining those types.
        if (objToStr.call(check) !== funObjStr) {
            throw new Error(check + " is not a function");
        }

        // The `name` parameter can be either a function or a string.
        var nameObjStr = objToStr.call(name);
        if (!(nameObjStr === funObjStr ||
          nameObjStr === strObjStr)) {
            throw new Error(name + " is neither a function nor a string");
        }

        const checkValue: CheckFn = function (value, deep) {
            var result = check.call(self, value, deep);
            if (!result && deep && objToStr.call(deep) === funObjStr)
                deep(self, value);
            return result;
        };

        Object.defineProperties(self, {
            name: {value: name},
            check: { value: checkValue }
        });
    } as any as TypeConstructor;

    var Tp: TypeType = Type.prototype;

    // Like .check, except that failure triggers an AssertionError.
    Tp.assert = function (value, deep) {
        if (!this.check(value, deep)) {
            var str = shallowStringify(value);
            throw new Error(str + " does not match type " + this);
        }
        return true;
    };

    function shallowStringify(value: any) {
        if (isObject.check(value))
            return "{" + Object.keys(value).map(function (key) {
                  return key + ": " + value[key];
              }).join(", ") + "}";

        if (isArray.check(value))
            return "[" + value.map(shallowStringify).join(", ") + "]";

        return JSON.stringify(value);
    }

    Tp.toString = function () {
        var name = this.name;

        if ((isString.check as NameStringCheck)(name))
            return name;

        if ((isFunction.check as NameFnCheck)(name))
            return name.call(this) + "";

        return name + " type";
    };

    var builtInCtorFns: any[] = [];
    var builtInCtorTypes: any[] = [];
    var builtInTypes: any = {};

    function defBuiltInType(example: {} | null | undefined, name: string) {
        var objStr = objToStr.call(example);

        var type = new Type(function (value) {
            return objToStr.call(value) === objStr;
        }, name);

        builtInTypes[name] = type;

        if (example && typeof example.constructor === "function") {
            builtInCtorFns.push(example.constructor);
            builtInCtorTypes.push(type);
        }

        return type;
    }

    // These types check the underlying [[Class]] attribute of the given
    // value, rather than using the problematic typeof operator. Note however
    // that no subtyping is considered; so, for instance, isObject.check
    // returns false for [], /./, new Date, and null.
    var isString = defBuiltInType("truthy", "string");
    var isFunction = defBuiltInType(function () {}, "function");
    var isArray = defBuiltInType([], "array");
    var isObject = defBuiltInType({}, "object");
    // @ts-ignore 'isRegExp' is declared but its value is never read. [6133]
    var isRegExp = defBuiltInType(/./, "RegExp");
    // @ts-ignore 'isDate' is declared but its value is never read. [6133]
    var isDate = defBuiltInType(new Date, "Date");
    // @ts-ignore 'isNumber' is declared but its value is never read. [6133]
    var isNumber = defBuiltInType(3, "number");
    // @ts-ignore 'isBoolean' is declared but its value is never read. [6133]
    var isBoolean = defBuiltInType(true, "boolean");
    // @ts-ignore 'isNull' is declared but its value is never read. [6133]
    var isNull = defBuiltInType(null, "null");
    var isUndefined = defBuiltInType(void 0, "undefined");

    // There are a number of idiomatic ways of expressing types, so this
    // function serves to coerce them all to actual Type objects. Note that
    // providing the name argument is not necessary in most cases.
    function toType(from: any, name?: any): TypeType {
        // The toType function should of course be idempotent.
        if (from instanceof Type)
            return from;

        // The Def type is used as a helper for constructing compound
        // interface types for AST nodes.
        if (from instanceof Def)
            return from.type;

        // Support [ElemType] syntax.
        if (isArray.check(from))
            return Type.fromArray(from);

        // Support { someField: FieldType, ... } syntax.
        if (isObject.check(from))
            return Type.fromObject(from);

        if (isFunction.check(from)) {
            var bicfIndex = builtInCtorFns.indexOf(from);
            if (bicfIndex >= 0) {
                return builtInCtorTypes[bicfIndex];
            }

            // If isFunction.check(from), and from is not a built-in
            // constructor, assume from is a binary predicate function we can
            // use to define the type.
            return new Type(from, name);
        }

        // As a last resort, toType returns a type that matches any value that
        // is === from. This is primarily useful for literal values like
        // toType(null), but it has the additional advantage of allowing
        // toType to be a total function.
        return new Type(function (value) {
            return value === from;
        }, isUndefined.check(name) ? function () {
            return from + "";
        } : name);
    }

    // Returns a type that matches the given value iff any of type1, type2,
    // etc. match the value.
    Type.or = function (/* type1, type2, ... */) {
        var types: any[] = [];
        var len = arguments.length;
        for (var i = 0; i < len; ++i)
            types.push(toType(arguments[i]));

        return new Type(function (value, deep) {
            for (var i = 0; i < len; ++i)
                if (types[i].check(value, deep))
                    return true;
            return false;
        }, function () {
            return types.join(" | ");
        });
    };

    Type.fromArray = function (arr: any) {
        if (!isArray.check(arr)) {
            throw new Error("");
        }
        if (arr.length !== 1) {
            throw new Error("only one element type is permitted for typed arrays");
        }
        return toType(arr[0]).arrayOf();
    };

    Tp.arrayOf = function () {
        var elemType = this;
        return new Type(function (value, deep) {
            return isArray.check(value) && value.every(function (elem: any) {
                  return elemType.check(elem, deep);
              });
        }, function () {
            return "[" + elemType + "]";
        });
    };

    Type.fromObject = function (obj: any) {
        var fields = Object.keys(obj).map(function (name) {
            return new Field(name, obj[name]);
        });

        return new Type(function (value, deep) {
            return isObject.check(value) && fields.every(function (field) {
                  return field.type.check(value[field.name], deep);
              });
        }, function () {
            return "{ " + fields.join(", ") + " }";
        });
    };

    const Field = function Field(this: FieldType, name: string, type: any, defaultFn?: Function, hidden?: boolean) {
        var self = this;

        if (!(self instanceof Field)) {
            throw new Error("Field constructor cannot be invoked without 'new'");
        }
        isString.assert(name);

        type = toType(type);

        var properties: any = {
            name: {value: name},
            type: {value: type},
            hidden: {value: !!hidden}
        };

        if (isFunction.check(defaultFn)) {
            properties.defaultFn = {value: defaultFn};
        }

        Object.defineProperties(self, properties);
    } as any as FieldConstructor;

    var Fp: FieldType = Field.prototype;

    Fp.toString = function () {
        return JSON.stringify(this.name) + ": " + this.type;
    };

    Fp.getValue = function (obj) {
        var value = obj[this.name];

        if (!isUndefined.check(value))
            return value;

        if (this.defaultFn)
            value = this.defaultFn.call(obj);

        return value;
    };

    // Define a type whose name is registered in a namespace (the defCache) so
    // that future definitions will return the same type given the same name.
    // In particular, this system allows for circular and forward definitions.
    // The Def object d returned from Type.def may be used to configure the
    // type d.type by calling methods such as d.bases, d.build, and d.field.
    Type.def = function (typeName) {
        isString.assert(typeName);
        return hasOwn.call(defCache, typeName)
          ? defCache[typeName]
          : defCache[typeName] = new Def(typeName);
    };

    // In order to return the same Def instance every time Type.def is called
    // with a particular name, those instances need to be stored in a cache.
    var defCache = Object.create(null);

    const Def = function Def(this: any, typeName: string) {
        var self = this;
        if (!(self instanceof Def)) {
            throw new Error("Def constructor cannot be invoked without 'new'");
        }

        Object.defineProperties(self, {
            typeName: {value: typeName},
            baseNames: {value: []},
            ownFields: {value: Object.create(null)},

            // These two are populated during finalization.
            allSupertypes: {value: Object.create(null)}, // Includes own typeName.
            supertypeList: {value: []}, // Linear inheritance hierarchy.
            allFields: {value: Object.create(null)}, // Includes inherited fields.
            fieldNames: {value: []}, // Non-hidden keys of allFields.

            type: {
                value: new Type(function (value, deep) {
                    return self.check(value, deep);
                }, typeName)
            }
        });
    } as any as DefConstructor;

    Def.fromValue = function (value) {
        if (value && typeof value === "object") {
            var type = value.type;
            if (typeof type === "string" &&
              hasOwn.call(defCache, type)) {
                var d = defCache[type];
                if (d.finalized) {
                    return d;
                }
            }
        }

        return null;
    };

    var Dp: DefType = Def.prototype;

    Dp.isSupertypeOf = function (that) {
        if (that instanceof Def) {
            if (this.finalized !== true ||
              that.finalized !== true) {
                throw new Error("");
            }
            return hasOwn.call(that.allSupertypes, this.typeName);
        } else {
            throw new Error(that + " is not a Def");
        }
    };

    // Note that the list returned by this function is a copy of the internal
    // supertypeList, *without* the typeName itself as the first element.
    function getSupertypeNames(typeName: any) {
        if (!hasOwn.call(defCache, typeName)) {
            throw new Error("");
        }
        var d = defCache[typeName];
        if (d.finalized !== true) {
            throw new Error("");
        }
        return d.supertypeList.slice(1);
    };

    // Returns an object mapping from every known type in the defCache to the
    // most specific supertype whose name is an own property of the candidates
    // object.
    function computeSupertypeLookupTable(candidates: any) {
        var table: { [typeName: string ]: any } = {};
        var typeNames = Object.keys(defCache);
        var typeNameCount = typeNames.length;

        for (var i = 0; i < typeNameCount; ++i) {
            var typeName = typeNames[i];
            var d = defCache[typeName];
            if (d.finalized !== true) {
                throw new Error("" + typeName);
            }
            for (var j = 0; j < d.supertypeList.length; ++j) {
                var superTypeName = d.supertypeList[j];
                if (hasOwn.call(candidates, superTypeName)) {
                    table[typeName] = superTypeName;
                    break;
                }
            }
        }

        return table;
    };

    Dp.checkAllFields = function (value, deep) {
        var allFields = this.allFields;
        if (this.finalized !== true) {
            throw new Error("" + this.typeName);
        }

        function checkFieldByName(name: string | number) {
            var field = allFields[name];
            var type = field.type;
            var child = field.getValue(value);
            return type.check(child, deep);
        }

        return isObject.check(value)
          && Object.keys(allFields).every(checkFieldByName);
    };

    Dp.check = function (value, deep) {
        if (this.finalized !== true) {
            throw new Error(
              "prematurely checking unfinalized type " + this.typeName
            );
        }

        // A Def type can only match an object value.
        if (!isObject.check(value))
            return false;

        var vDef = Def.fromValue(value);
        if (!vDef) {
            // If we couldn't infer the Def associated with the given value,
            // and we expected it to be a SourceLocation or a Position, it was
            // probably just missing a "type" field (because Esprima does not
            // assign a type property to such nodes). Be optimistic and let
            // this.checkAllFields make the final decision.
            if (this.typeName === "SourceLocation" ||
              this.typeName === "Position") {
                return this.checkAllFields(value, deep);
            }

            // Calling this.checkAllFields for any other type of node is both
            // bad for performance and way too forgiving.
            return false;
        }

        // If checking deeply and vDef === this, then we only need to call
        // checkAllFields once. Calling checkAllFields is too strict when deep
        // is false, because then we only care about this.isSupertypeOf(vDef).
        if (deep && vDef === this)
            return this.checkAllFields(value, deep);

        // In most cases we rely exclusively on isSupertypeOf to make O(1)
        // subtyping determinations. This suffices in most situations outside
        // of unit tests, since interface conformance is checked whenever new
        // instances are created using builder functions.
        if (!this.isSupertypeOf(vDef))
            return false;

        // The exception is when deep is true; then, we recursively check all
        // fields.
        if (!deep)
            return true;

        // Use the more specific Def (vDef) to perform the deep check, but
        // shallow-check fields defined by the less specific Def (this).
        return vDef.checkAllFields(value, deep)
          && this.checkAllFields(value, false);
    };

    Dp.bases = function () {
        var args = slice.call(arguments);
        var bases = this.baseNames;

        if (this.finalized) {
            if (args.length !== bases.length) {
                throw new Error("");
            }
            for (var i = 0; i < args.length; i++) {
                if (args[i] !== bases[i]) {
                    throw new Error("");
                }
            }
            return this;
        }

        args.forEach(function (baseName: any) {
            isString.assert(baseName);

            // This indexOf lookup may be O(n), but the typical number of base
            // names is very small, and indexOf is a native Array method.
            if (bases.indexOf(baseName) < 0)
                bases.push(baseName);
        });

        return this; // For chaining.
    };

    // False by default until .build(...) is called on an instance.
    Object.defineProperty(Dp, "buildable", {value: false});

    var builders: any = {};

    // This object is used as prototype for any node created by a builder.
    var nodePrototype: any = {};

    // Call this function to define a new method to be shared by all AST
     // nodes. The replaced method (if any) is returned for easy wrapping.
    function defineMethod(name: any, func: any) {
        var old: any = nodePrototype[name];

        // Pass undefined as func to delete nodePrototype[name].
        if (isUndefined.check(func)) {
            delete nodePrototype[name];

        } else {
            isFunction.assert(func);

            Object.defineProperty(nodePrototype, name, {
                enumerable: true, // For discoverability.
                configurable: true, // For delete proto[name].
                value: func
            });
        }

        return old;
    };

    var isArrayOfString = isString.arrayOf();

    // Calling the .build method of a Def simultaneously marks the type as
    // buildable (by defining builders[getBuilderName(typeName)]) and
    // specifies the order of arguments that should be passed to the builder
    // function to create an instance of the type.
    Dp.build = function (/* param1, param2, ... */) {
        var self = this;

        var newBuildParams = slice.call(arguments);
        isArrayOfString.assert(newBuildParams);

        // Calling Def.prototype.build multiple times has the effect of merely
        // redefining this property.
        Object.defineProperty(self, "buildParams", {
            value: newBuildParams,
            writable: false,
            enumerable: false,
            configurable: true
        });

        if (self.buildable) {
            // If this Def is already buildable, update self.buildParams and
            // continue using the old builder function.
            return self;
        }

        // Every buildable type will have its "type" field filled in
        // automatically. This includes types that are not subtypes of Node,
        // like SourceLocation, but that seems harmless (TODO?).
        self.field("type", String, function () { return self.typeName });

        // Override Dp.buildable for this Def instance.
        Object.defineProperty(self, "buildable", {value: true});

        function addParam(built: any, param: any, arg: any, isArgAvailable: boolean) {
            if (hasOwn.call(built, param))
                return;

            var all = self.allFields;
            if (!hasOwn.call(all, param)) {
                throw new Error("" + param);
            }

            var field = all[param];
            var type = field.type;
            var value;

            if (isArgAvailable) {
                value = arg;
            } else if (field.defaultFn) {
                // Expose the partially-built object to the default
                // function as its `this` object.
                value = field.defaultFn.call(built);
            } else {
                var message = "no value or default function given for field " +
                  JSON.stringify(param) + " of " + self.typeName + "(" +
                  self.buildParams.map(function (name: any) {
                      return all[name];
                  }).join(", ") + ")";
                throw new Error(message);
            }

            if (!type.check(value)) {
                throw new Error(
                  shallowStringify(value) +
                  " does not match field " + field +
                  " of type " + self.typeName
                );
            }

            built[param] = value;
        }

        // Calling the builder function will construct an instance of the Def,
        // with positional arguments mapped to the fields original passed to .build.
        // If not enough arguments are provided, the default value for the remaining fields
        // will be used.
        function builder() {
            var args = arguments;
            var argc = args.length;

            if (!self.finalized) {
                throw new Error(
                    "attempting to instantiate unfinalized type " +
                    self.typeName
                );
            }

            var built = Object.create(nodePrototype);

            self.buildParams.forEach(function (param: any, i: number) {
                if (i < argc) {
                    addParam(built, param, args[i], true)
                } else {
                    addParam(built, param, null, false);
                }
            });

            Object.keys(self.allFields).forEach(function (param) {
                // Use the default value.
                addParam(built, param, null, false);
            });

            // Make sure that the "type" field was filled automatically.
            if (built.type !== self.typeName) {
                throw new Error("");
            }

            return built;
        }

        // Calling .from on the builder function will construct an instance of the Def,
        // using field values from the passed object. For fields missing from the passed object,
        // their default value will be used.
        builder.from = function (obj: any) {
            if (!self.finalized) {
                throw new Error(
                    "attempting to instantiate unfinalized type " +
                    self.typeName
                );
            }

            var built = Object.create(nodePrototype);

            Object.keys(self.allFields).forEach(function (param) {
                if (hasOwn.call(obj, param)) {
                    addParam(built, param, obj[param], true);
                } else {
                    addParam(built, param, null, false);
                }
            });

            // Make sure that the "type" field was filled automatically.
            if (built.type !== self.typeName) {
                throw new Error("");
            }

            return built;
        }

        Object.defineProperty(builders, getBuilderName(self.typeName), {
            enumerable: true,
            value: builder
        });

        return self; // For chaining.
    };

    function getBuilderName(typeName: any) {
        return typeName.replace(/^[A-Z]+/, function (upperCasePrefix: any) {
            var len = upperCasePrefix.length;
            switch (len) {
                case 0: return "";
                // If there's only one initial capital letter, just lower-case it.
                case 1: return upperCasePrefix.toLowerCase();
                default:
                    // If there's more than one initial capital letter, lower-case
                    // all but the last one, so that XMLDefaultDeclaration (for
                    // example) becomes xmlDefaultDeclaration.
                    return upperCasePrefix.slice(
                        0, len - 1).toLowerCase() +
                      upperCasePrefix.charAt(len - 1);
            }
        });
    }

    function getStatementBuilderName(typeName: any) {
        typeName = getBuilderName(typeName);
        return typeName.replace(/(Expression)?$/, "Statement");
    }

    // The reason fields are specified using .field(...) instead of an object
    // literal syntax is somewhat subtle: the object literal syntax would
    // support only one key and one value, but with .field(...) we can pass
    // any number of arguments to specify the field.
    Dp.field = function (name, type, defaultFn, hidden) {
        if (this.finalized) {
            console.error("Ignoring attempt to redefine field " +
              JSON.stringify(name) + " of finalized type " +
              JSON.stringify(this.typeName));
            return this;
        }
        this.ownFields[name] = new Field(name, type, defaultFn, hidden);
        return this; // For chaining.
    };

    var namedTypes = {};

    // Like Object.keys, but aware of what fields each AST type should have.
    function getFieldNames(object: any) {
        var d = Def.fromValue(object);
        if (d) {
            return d.fieldNames.slice(0);
        }

        if ("type" in object) {
            throw new Error(
              "did not recognize object of type " +
              JSON.stringify(object.type)
            );
        }

        return Object.keys(object);
    }

    // Get the value of an object property, taking object.type and default
    // functions into account.
    function getFieldValue(object: any, fieldName: any) {
        var d = Def.fromValue(object);
        if (d) {
            var field = d.allFields[fieldName];
            if (field) {
                return field.getValue(object);
            }
        }

        return object && object[fieldName];
    }

    // Iterate over all defined fields of an object, including those missing
    // or undefined, passing each field name and effective value (as returned
    // by getFieldValue) to the callback. If the object has no corresponding
    // Def, the callback will never be called.
    function eachField(object: any, callback: any, context: any) {
        getFieldNames(object).forEach(function (this: any, name: any) {
            callback.call(this, name, getFieldValue(object, name));
        }, context);
    };

    // Similar to eachField, except that iteration stops as soon as the
    // callback returns a truthy value. Like Array.prototype.some, the final
    // result is either true or false to indicates whether the callback
    // returned true for any element or not.
    function someField(object: any, callback: any, context: any) {
        return getFieldNames(object).some(function (this: any, name: any) {
            return callback.call(this, name, getFieldValue(object, name));
        }, context);
    };

    // This property will be overridden as true by individual Def instances
    // when they are finalized.
    Object.defineProperty(Dp, "finalized", {value: false});

    Dp.finalize = function () {
        var self = this;

        // It's not an error to finalize a type more than once, but only the
        // first call to .finalize does anything.
        if (!self.finalized) {
            var allFields = self.allFields;
            var allSupertypes = self.allSupertypes;

            self.baseNames.forEach(function (name: any) {
                var def = defCache[name];
                if (def instanceof Def) {
                    def.finalize();
                    extend(allFields, def.allFields);
                    extend(allSupertypes, def.allSupertypes);
                } else {
                    var message = "unknown supertype name " +
                      JSON.stringify(name) +
                      " for subtype " +
                      JSON.stringify(self.typeName);
                    throw new Error(message);
                }
            });

            // TODO Warn if fields are overridden with incompatible types.
            extend(allFields, self.ownFields);
            allSupertypes[self.typeName] = self;

            self.fieldNames.length = 0;
            for (var fieldName in allFields) {
                if (hasOwn.call(allFields, fieldName) &&
                    !allFields[fieldName].hidden) {
                        self.fieldNames.push(fieldName);
                }
            }

            // Types are exported only once they have been finalized.
            Object.defineProperty(namedTypes, self.typeName, {
                enumerable: true,
                value: self.type
            });

            Object.defineProperty(self, "finalized", {value: true});

            // A linearization of the inheritance hierarchy.
            populateSupertypeList(self.typeName, self.supertypeList);

            if (self.buildable && self.supertypeList.lastIndexOf("Expression") >= 0) {
                wrapExpressionBuilderWithStatement(self.typeName);
            }
        }
    };

    // Adds an additional builder for Expression subtypes
    // that wraps the built Expression in an ExpressionStatements.
    function wrapExpressionBuilderWithStatement(typeName: any) {
        var wrapperName = getStatementBuilderName(typeName);

        // skip if the builder already exists
        if (builders[wrapperName]) return;

        // the builder function to wrap with builders.ExpressionStatement
        var wrapped = builders[getBuilderName(typeName)];

        // skip if there is nothing to wrap
        if (!wrapped) return;

        builders[wrapperName] = function () {
            return builders.expressionStatement(wrapped.apply(builders, arguments));
        };
    }

    function populateSupertypeList(typeName: any, list: any) {
        list.length = 0;
        list.push(typeName);

        var lastSeen = Object.create(null);

        for (var pos = 0; pos < list.length; ++pos) {
            typeName = list[pos];
            var d = defCache[typeName];
            if (d.finalized !== true) {
                throw new Error("");
            }

            // If we saw typeName earlier in the breadth-first traversal,
            // delete the last-seen occurrence.
            if (hasOwn.call(lastSeen, typeName)) {
                delete list[lastSeen[typeName]];
            }

            // Record the new index of the last-seen occurrence of typeName.
            lastSeen[typeName] = pos;

            // Enqueue the base names of this type.
            list.push.apply(list, d.baseNames);
        }

        // Compaction loop to remove array holes.
        for (var to = 0, from = to, len = list.length; from < len; ++from) {
            if (hasOwn.call(list, from)) {
                list[to++] = list[from];
            }
        }

        list.length = to;
    }

    function extend(into: any, from: any) {
        Object.keys(from).forEach(function (name) {
            into[name] = from[name];
        });

        return into;
    };

    function finalize() {
        Object.keys(defCache).forEach(function (name) {
            defCache[name].finalize();
        });
    };

    return {
        // Throughout this file we use Object.defineProperty to prevent
        // redefinition of exported properties.
        Type,

        builtInTypes,
        getSupertypeNames,
        computeSupertypeLookupTable,
        builders,
        defineMethod,
        getBuilderName,
        getStatementBuilderName,
        namedTypes,
        getFieldNames,
        getFieldValue,
        eachField,
        someField,
        finalize,
    };
};

export = typesPlugin;

import fs from "fs";
import path from "path";
import { prettyPrint } from "recast";
import typesModuleFn, { NameType, AnyType, Field } from "../lib/types";
import astTypes from "../main";
import { StatementKind } from "../gen/kinds";

const { getBuilderName } = typesModuleFn();
const { builders: b, namedTypes: n, Type } = astTypes;

const RESERVED: { [reserved: string]: boolean | undefined } = {
  extends: true,
  default: true,
  arguments: true,
  static: true,
};

const supertypeToSubtypes: { [supertypeName: string]: string[] } = {};
Object.keys(astTypes.namedTypes).map(typeName => {
  astTypes.Type.def(typeName).supertypeList.forEach(supertypeName => {
    supertypeToSubtypes[supertypeName] = supertypeToSubtypes[supertypeName] || [];
    supertypeToSubtypes[supertypeName].push(typeName);
  });
});

function referenceForType(type: string) {
  return !supertypeToSubtypes[type] || supertypeToSubtypes[type].length === 0
    ? b.identifier(type)
    : b.tsQualifiedName(b.identifier("K"), b.identifier(`${type}Kind`));
}

function resolveName(name: NameType): string {
  return typeof name === "function" ? name() : name;
}

function getTypeAnnotation(type: AnyType): any {
  const typeName = resolveName(type.name);

  if (typeName === "undefined") {
    return b.tsUndefinedKeyword();
  }
  if (typeName === "null") {
    return b.tsNullKeyword();
  }
  if (typeName === "string") {
    return b.tsStringKeyword();
  }
  if (typeName === "boolean") {
    return b.tsBooleanKeyword();
  }
  if (typeName === "true" || typeName === "false") {
    return b.tsLiteralType(b.booleanLiteral(typeName === "true"));
  }
  if (typeName === "number" || /^number [<>=]+ \d+$/.test(typeName)) {
    return b.tsNumberKeyword();
  }

  if (type instanceof Type.OrType) {
    return b.tsUnionType(type.types.map(childType => getTypeAnnotation(childType)));
  }

  if (type instanceof Type.ArrayType) {
    const elemTypeAnnotation = getTypeAnnotation(type.elemType);
    return n.TSUnionType.check(elemTypeAnnotation)
      ? b.tsArrayType(b.tsParenthesizedType(elemTypeAnnotation))
      : b.tsArrayType(elemTypeAnnotation);
  }

  if (type instanceof Type.ObjectType) {
    return b.tsTypeLiteral.from({
      members: type.fields.map(field => getPropertySignature(field)),
    });
  }

  if (/^[A-Z]/.test(typeName)) {
    return b.tsTypeReference(referenceForType(typeName));
  }

  return b.tsLiteralType(b.stringLiteral(typeName));
}

function getPropertySignature(field: Field) {
  return b.tsPropertySignature.from({
    key: b.identifier(field.name),
    typeAnnotation: b.tsTypeAnnotation(getTypeAnnotation(field.type)),
    optional: field.defaultFn != null || field.hidden,
  });
}

const builderTypeNames = Object.keys(astTypes.namedTypes).filter(typeName => {
  const typeDef = astTypes.Type.def(typeName);
  const builderName = getBuilderName(typeName);

  return !!typeDef.buildParams && !!(astTypes.builders as any)[builderName];
});

const createModule = (body: StatementKind[]) =>
  b.file.from({
    program: b.program(body),
    comments: [b.commentBlock(" !!! THIS FILE WAS AUTO-GENERATED BY `npm run gen` !!! ")],
  });

const importFromKinds = () =>
  b.importDeclaration.from({
    specifiers: [
      b.importNamespaceSpecifier.from({
        local: b.identifier("K"),
      }),
    ],
    source: b.stringLiteral("./kinds"),
  });

const importFromNodes = () =>
  b.importDeclaration.from({
    specifiers: [
      b.importNamespaceSpecifier.from({
        local: b.identifier("N"),
      }),
    ],
    source: b.stringLiteral("./nodes"),
  });

const out = [
  {
    file: "kinds.ts",
    ast: createModule([
      importFromNodes(),
      ...Object.keys(supertypeToSubtypes).map(baseName => {
        return b.exportNamedDeclaration(
          b.tsTypeAliasDeclaration.from({
            id: b.identifier(`${baseName}Kind`),
            typeAnnotation: b.tsUnionType(
              supertypeToSubtypes[baseName].map(subtypeName =>
                b.tsTypeReference(b.tsQualifiedName(b.identifier("N"), b.identifier(subtypeName)))
              )
            ),
          })
        );
      }),
    ]),
  },
  {
    file: "nodes.ts",
    ast: createModule([
      b.importDeclaration.from({
        specifiers: [b.importSpecifier(b.identifier("ASTNode"))],
        source: b.stringLiteral("../lib/types"),
      }),
      importFromKinds(),
      ...Object.keys(astTypes.namedTypes).map(typeName => {
        const typeDef = astTypes.Type.def(typeName);
        return b.exportNamedDeclaration(
          b.tsInterfaceDeclaration.from({
            id: b.identifier(typeName),
            extends: [b.tsExpressionWithTypeArguments(b.identifier("ASTNode"))],
            body: b.tsInterfaceBody.from({
              body: Object.keys(typeDef.allFields).map(fieldName => {
                const field = typeDef.allFields[fieldName];

                if (fieldName === "type") {
                  return b.tsPropertySignature.from({
                    key: b.identifier(fieldName),
                    typeAnnotation: b.tsTypeAnnotation(b.tsLiteralType(b.stringLiteral(typeName))),
                  });
                }

                return getPropertySignature(field);
              }),
            }),
          })
        );
      }),
    ]),
  },
  {
    file: "namedTypes.ts",
    ast: createModule([
      b.importDeclaration.from({
        specifiers: [b.importSpecifier(b.identifier("Type"), b.identifier("Type"))],
        source: b.stringLiteral("../lib/types"),
      }),
      importFromNodes(),
      b.exportNamedDeclaration(
        b.tsInterfaceDeclaration.from({
          id: b.identifier("NamedTypes"),
          body: b.tsInterfaceBody.from({
            body: Object.keys(astTypes.namedTypes).map(typeName => {
              return b.tsPropertySignature.from({
                key: b.identifier(typeName),
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier("Type"),
                    typeParameters: b.tsTypeParameterInstantiation([
                      b.tsTypeReference(
                        b.tsQualifiedName(b.identifier("N"), b.identifier(typeName))
                      ),
                    ]),
                  }),
                }),
              });
            }),
          }),
        })
      ),
    ]),
  },
  {
    file: "builders.ts",
    ast: createModule([
      importFromKinds(),
      importFromNodes(),
      ...builderTypeNames.map(typeName => {
        const typeDef = astTypes.Type.def(typeName);

        const returnType = b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.tsQualifiedName.from({
              left: b.identifier("N"),
              right: b.identifier(typeName),
            }),
          }),
        });

        const buildParamAllowsUndefined: { [buildParam: string]: boolean } = {};
        const buildParamIsOptional: { [buildParam: string]: boolean } = {};
        [...typeDef.buildParams].reverse().forEach((cur, i, arr) => {
          const field = typeDef.allFields[cur];
          if (field && field.defaultFn) {
            if (i === 0) {
              buildParamIsOptional[cur] = true;
            } else {
              if (buildParamIsOptional[arr[i - 1]]) {
                buildParamIsOptional[cur] = true;
              } else {
                buildParamAllowsUndefined[cur] = true;
              }
            }
          }
        });

        return b.exportNamedDeclaration(
          b.tsInterfaceDeclaration.from({
            id: b.identifier(`${typeName}Builder`),
            body: b.tsInterfaceBody.from({
              body: [
                b.tsCallSignatureDeclaration.from({
                  parameters: typeDef.buildParams
                    .filter(buildParam => !!typeDef.allFields[buildParam])
                    .map(buildParam => {
                      const field = typeDef.allFields[buildParam];
                      const name = RESERVED[buildParam] ? `${buildParam}Param` : buildParam;

                      return b.identifier.from({
                        name,
                        typeAnnotation: b.tsTypeAnnotation(
                          !!buildParamAllowsUndefined[buildParam]
                            ? b.tsUnionType([
                                getTypeAnnotation(field.type),
                                b.tsUndefinedKeyword(),
                              ])
                            : getTypeAnnotation(field.type)
                        ),
                        optional: !!buildParamIsOptional[buildParam],
                      });
                    }),
                  typeAnnotation: returnType,
                }),
                b.tsMethodSignature.from({
                  key: b.identifier("from"),
                  parameters: [
                    b.identifier.from({
                      name: "params",
                      typeAnnotation: b.tsTypeAnnotation.from({
                        typeAnnotation: b.tsTypeLiteral.from({
                          members: Object.keys(typeDef.allFields)
                            .filter(fieldName => fieldName !== "type")
                            .sort((fieldName1, fieldName2) => {
                              const field1 = typeDef.allFields[fieldName1];
                              const field2 = typeDef.allFields[fieldName2];
                              return field1.name < field2.name ? -1 : 1;
                            })
                            .map(fieldName => {
                              const field = typeDef.allFields[fieldName];


                              return getPropertySignature(field);
                            }),
                        }),
                      }),
                    }),
                  ],
                  typeAnnotation: returnType,
                }),
              ],
            }),
          })
        );
      }),

      b.exportNamedDeclaration(
        b.tsInterfaceDeclaration.from({
          id: b.identifier("Builders"),
          body: b.tsInterfaceBody([
            ...builderTypeNames.map(typeName =>
              b.tsPropertySignature.from({
                key: b.identifier(getBuilderName(typeName)),
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier(`${typeName}Builder`),
                  }),
                }),
              })
            ),
            b.tsIndexSignature.from({
              parameters: [
                b.identifier.from({
                  name: "builderName",
                  typeAnnotation: b.tsTypeAnnotation(b.tsStringKeyword()),
                }),
              ],
              typeAnnotation: b.tsTypeAnnotation.from({ typeAnnotation: b.tsAnyKeyword() }),
            }),
          ]),
        })
      ),
    ]),
  },
  {
    file: "visitor.ts",
    ast: createModule([
      b.importDeclaration(
        [b.importSpecifier(b.identifier("NodePath"), b.identifier("NodePath"))],
        b.stringLiteral("../lib/node-path")
      ),
      b.importDeclaration(
        [b.importSpecifier(b.identifier("Context"), b.identifier("Context"))],
        b.stringLiteral("../lib/path-visitor")
      ),
      importFromNodes(),
      b.exportNamedDeclaration(
        b.tsInterfaceDeclaration.from({
          id: b.identifier("Visitor"),
          typeParameters: b.tsTypeParameterDeclaration([
            b.tsTypeParameter("M", undefined, b.tsTypeLiteral([])),
          ]),
          body: b.tsInterfaceBody([
            ...Object.keys(astTypes.namedTypes).map(typeName => {
              return b.tsMethodSignature.from({
                key: b.identifier(`visit${typeName}`),
                parameters: [
                  b.identifier.from({
                    name: "this",
                    typeAnnotation: b.tsTypeAnnotation(
                      b.tsIntersectionType([
                        b.tsTypeReference(b.identifier("Context")),
                        b.tsTypeReference(b.identifier("M")),
                      ])
                    ),
                  }),
                  b.identifier.from({
                    name: "path",
                    typeAnnotation: b.tsTypeAnnotation(
                      b.tsTypeReference(
                        b.identifier("NodePath"),
                        b.tsTypeParameterInstantiation([
                          b.tsTypeReference(
                            b.tsQualifiedName(b.identifier("N"), b.identifier(typeName))
                          ),
                        ])
                      )
                    ),
                  }),
                ],
                optional: true,
                typeAnnotation: b.tsTypeAnnotation(b.tsAnyKeyword()),
              });
            }),
          ]),
        })
      ),
    ]),
  },
];

out.forEach(({ file, ast }) => {
  fs.writeFileSync(
    path.resolve(__dirname, `../gen/${file}`),
    prettyPrint(ast, { tabWidth: 2, includeComments: true }).code
  );
});

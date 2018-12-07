/* !!! THIS FILE WAS AUTO-GENERATED BY `npm run gen` !!! */
import { NodePath } from "../lib/node-path";
import { Context } from "../lib/path-visitor";
import * as N from "./nodes";

export interface Visitor<M = {}> {
  visitPrintable?(this: Context & M, path: NodePath<N.Printable>): any;
  visitSourceLocation?(this: Context & M, path: NodePath<N.SourceLocation>): any;
  visitNode?(this: Context & M, path: NodePath<N.Node>): any;
  visitComment?(this: Context & M, path: NodePath<N.Comment>): any;
  visitPosition?(this: Context & M, path: NodePath<N.Position>): any;
  visitFile?(this: Context & M, path: NodePath<N.File>): any;
  visitProgram?(this: Context & M, path: NodePath<N.Program>): any;
  visitStatement?(this: Context & M, path: NodePath<N.Statement>): any;
  visitFunction?(this: Context & M, path: NodePath<N.Function>): any;
  visitPattern?(this: Context & M, path: NodePath<N.Pattern>): any;
  visitExpression?(this: Context & M, path: NodePath<N.Expression>): any;
  visitIdentifier?(this: Context & M, path: NodePath<N.Identifier>): any;
  visitBlockStatement?(this: Context & M, path: NodePath<N.BlockStatement>): any;
  visitEmptyStatement?(this: Context & M, path: NodePath<N.EmptyStatement>): any;
  visitExpressionStatement?(this: Context & M, path: NodePath<N.ExpressionStatement>): any;
  visitIfStatement?(this: Context & M, path: NodePath<N.IfStatement>): any;
  visitLabeledStatement?(this: Context & M, path: NodePath<N.LabeledStatement>): any;
  visitBreakStatement?(this: Context & M, path: NodePath<N.BreakStatement>): any;
  visitContinueStatement?(this: Context & M, path: NodePath<N.ContinueStatement>): any;
  visitWithStatement?(this: Context & M, path: NodePath<N.WithStatement>): any;
  visitSwitchStatement?(this: Context & M, path: NodePath<N.SwitchStatement>): any;
  visitSwitchCase?(this: Context & M, path: NodePath<N.SwitchCase>): any;
  visitReturnStatement?(this: Context & M, path: NodePath<N.ReturnStatement>): any;
  visitThrowStatement?(this: Context & M, path: NodePath<N.ThrowStatement>): any;
  visitTryStatement?(this: Context & M, path: NodePath<N.TryStatement>): any;
  visitCatchClause?(this: Context & M, path: NodePath<N.CatchClause>): any;
  visitWhileStatement?(this: Context & M, path: NodePath<N.WhileStatement>): any;
  visitDoWhileStatement?(this: Context & M, path: NodePath<N.DoWhileStatement>): any;
  visitForStatement?(this: Context & M, path: NodePath<N.ForStatement>): any;
  visitDeclaration?(this: Context & M, path: NodePath<N.Declaration>): any;
  visitVariableDeclaration?(this: Context & M, path: NodePath<N.VariableDeclaration>): any;
  visitForInStatement?(this: Context & M, path: NodePath<N.ForInStatement>): any;
  visitDebuggerStatement?(this: Context & M, path: NodePath<N.DebuggerStatement>): any;
  visitFunctionDeclaration?(this: Context & M, path: NodePath<N.FunctionDeclaration>): any;
  visitFunctionExpression?(this: Context & M, path: NodePath<N.FunctionExpression>): any;
  visitVariableDeclarator?(this: Context & M, path: NodePath<N.VariableDeclarator>): any;
  visitThisExpression?(this: Context & M, path: NodePath<N.ThisExpression>): any;
  visitArrayExpression?(this: Context & M, path: NodePath<N.ArrayExpression>): any;
  visitObjectExpression?(this: Context & M, path: NodePath<N.ObjectExpression>): any;
  visitProperty?(this: Context & M, path: NodePath<N.Property>): any;
  visitLiteral?(this: Context & M, path: NodePath<N.Literal>): any;
  visitSequenceExpression?(this: Context & M, path: NodePath<N.SequenceExpression>): any;
  visitUnaryExpression?(this: Context & M, path: NodePath<N.UnaryExpression>): any;
  visitBinaryExpression?(this: Context & M, path: NodePath<N.BinaryExpression>): any;
  visitAssignmentExpression?(this: Context & M, path: NodePath<N.AssignmentExpression>): any;
  visitUpdateExpression?(this: Context & M, path: NodePath<N.UpdateExpression>): any;
  visitLogicalExpression?(this: Context & M, path: NodePath<N.LogicalExpression>): any;
  visitConditionalExpression?(this: Context & M, path: NodePath<N.ConditionalExpression>): any;
  visitNewExpression?(this: Context & M, path: NodePath<N.NewExpression>): any;
  visitCallExpression?(this: Context & M, path: NodePath<N.CallExpression>): any;
  visitMemberExpression?(this: Context & M, path: NodePath<N.MemberExpression>): any;
  visitRestElement?(this: Context & M, path: NodePath<N.RestElement>): any;
  visitTypeAnnotation?(this: Context & M, path: NodePath<N.TypeAnnotation>): any;
  visitTSTypeAnnotation?(this: Context & M, path: NodePath<N.TSTypeAnnotation>): any;
  visitSpreadElementPattern?(this: Context & M, path: NodePath<N.SpreadElementPattern>): any;
  visitArrowFunctionExpression?(this: Context & M, path: NodePath<N.ArrowFunctionExpression>): any;
  visitForOfStatement?(this: Context & M, path: NodePath<N.ForOfStatement>): any;
  visitYieldExpression?(this: Context & M, path: NodePath<N.YieldExpression>): any;
  visitGeneratorExpression?(this: Context & M, path: NodePath<N.GeneratorExpression>): any;
  visitComprehensionBlock?(this: Context & M, path: NodePath<N.ComprehensionBlock>): any;
  visitComprehensionExpression?(this: Context & M, path: NodePath<N.ComprehensionExpression>): any;
  visitObjectProperty?(this: Context & M, path: NodePath<N.ObjectProperty>): any;
  visitPropertyPattern?(this: Context & M, path: NodePath<N.PropertyPattern>): any;
  visitObjectPattern?(this: Context & M, path: NodePath<N.ObjectPattern>): any;
  visitArrayPattern?(this: Context & M, path: NodePath<N.ArrayPattern>): any;
  visitMethodDefinition?(this: Context & M, path: NodePath<N.MethodDefinition>): any;
  visitSpreadElement?(this: Context & M, path: NodePath<N.SpreadElement>): any;
  visitAssignmentPattern?(this: Context & M, path: NodePath<N.AssignmentPattern>): any;
  visitClassPropertyDefinition?(this: Context & M, path: NodePath<N.ClassPropertyDefinition>): any;
  visitClassProperty?(this: Context & M, path: NodePath<N.ClassProperty>): any;
  visitClassBody?(this: Context & M, path: NodePath<N.ClassBody>): any;
  visitClassDeclaration?(this: Context & M, path: NodePath<N.ClassDeclaration>): any;
  visitClassExpression?(this: Context & M, path: NodePath<N.ClassExpression>): any;
  visitSpecifier?(this: Context & M, path: NodePath<N.Specifier>): any;
  visitModuleSpecifier?(this: Context & M, path: NodePath<N.ModuleSpecifier>): any;
  visitImportSpecifier?(this: Context & M, path: NodePath<N.ImportSpecifier>): any;
  visitImportNamespaceSpecifier?(this: Context & M, path: NodePath<N.ImportNamespaceSpecifier>): any;
  visitImportDefaultSpecifier?(this: Context & M, path: NodePath<N.ImportDefaultSpecifier>): any;
  visitImportDeclaration?(this: Context & M, path: NodePath<N.ImportDeclaration>): any;
  visitTaggedTemplateExpression?(this: Context & M, path: NodePath<N.TaggedTemplateExpression>): any;
  visitTemplateLiteral?(this: Context & M, path: NodePath<N.TemplateLiteral>): any;
  visitTemplateElement?(this: Context & M, path: NodePath<N.TemplateElement>): any;
  visitSpreadProperty?(this: Context & M, path: NodePath<N.SpreadProperty>): any;
  visitSpreadPropertyPattern?(this: Context & M, path: NodePath<N.SpreadPropertyPattern>): any;
  visitAwaitExpression?(this: Context & M, path: NodePath<N.AwaitExpression>): any;
  visitLetStatement?(this: Context & M, path: NodePath<N.LetStatement>): any;
  visitLetExpression?(this: Context & M, path: NodePath<N.LetExpression>): any;
  visitGraphExpression?(this: Context & M, path: NodePath<N.GraphExpression>): any;
  visitGraphIndexExpression?(this: Context & M, path: NodePath<N.GraphIndexExpression>): any;
  visitXMLDefaultDeclaration?(this: Context & M, path: NodePath<N.XMLDefaultDeclaration>): any;
  visitXMLAnyName?(this: Context & M, path: NodePath<N.XMLAnyName>): any;
  visitXMLQualifiedIdentifier?(this: Context & M, path: NodePath<N.XMLQualifiedIdentifier>): any;
  visitXMLFunctionQualifiedIdentifier?(this: Context & M, path: NodePath<N.XMLFunctionQualifiedIdentifier>): any;
  visitXMLAttributeSelector?(this: Context & M, path: NodePath<N.XMLAttributeSelector>): any;
  visitXMLFilterExpression?(this: Context & M, path: NodePath<N.XMLFilterExpression>): any;
  visitXML?(this: Context & M, path: NodePath<N.XML>): any;
  visitXMLElement?(this: Context & M, path: NodePath<N.XMLElement>): any;
  visitXMLList?(this: Context & M, path: NodePath<N.XMLList>): any;
  visitXMLEscape?(this: Context & M, path: NodePath<N.XMLEscape>): any;
  visitXMLText?(this: Context & M, path: NodePath<N.XMLText>): any;
  visitXMLStartTag?(this: Context & M, path: NodePath<N.XMLStartTag>): any;
  visitXMLEndTag?(this: Context & M, path: NodePath<N.XMLEndTag>): any;
  visitXMLPointTag?(this: Context & M, path: NodePath<N.XMLPointTag>): any;
  visitXMLName?(this: Context & M, path: NodePath<N.XMLName>): any;
  visitXMLAttribute?(this: Context & M, path: NodePath<N.XMLAttribute>): any;
  visitXMLCdata?(this: Context & M, path: NodePath<N.XMLCdata>): any;
  visitXMLComment?(this: Context & M, path: NodePath<N.XMLComment>): any;
  visitXMLProcessingInstruction?(this: Context & M, path: NodePath<N.XMLProcessingInstruction>): any;
  visitJSXAttribute?(this: Context & M, path: NodePath<N.JSXAttribute>): any;
  visitJSXIdentifier?(this: Context & M, path: NodePath<N.JSXIdentifier>): any;
  visitJSXNamespacedName?(this: Context & M, path: NodePath<N.JSXNamespacedName>): any;
  visitJSXExpressionContainer?(this: Context & M, path: NodePath<N.JSXExpressionContainer>): any;
  visitJSXMemberExpression?(this: Context & M, path: NodePath<N.JSXMemberExpression>): any;
  visitJSXSpreadAttribute?(this: Context & M, path: NodePath<N.JSXSpreadAttribute>): any;
  visitJSXElement?(this: Context & M, path: NodePath<N.JSXElement>): any;
  visitJSXOpeningElement?(this: Context & M, path: NodePath<N.JSXOpeningElement>): any;
  visitJSXClosingElement?(this: Context & M, path: NodePath<N.JSXClosingElement>): any;
  visitJSXFragment?(this: Context & M, path: NodePath<N.JSXFragment>): any;
  visitJSXText?(this: Context & M, path: NodePath<N.JSXText>): any;
  visitJSXOpeningFragment?(this: Context & M, path: NodePath<N.JSXOpeningFragment>): any;
  visitJSXClosingFragment?(this: Context & M, path: NodePath<N.JSXClosingFragment>): any;
  visitJSXEmptyExpression?(this: Context & M, path: NodePath<N.JSXEmptyExpression>): any;
  visitJSXSpreadChild?(this: Context & M, path: NodePath<N.JSXSpreadChild>): any;
  visitTypeParameterDeclaration?(this: Context & M, path: NodePath<N.TypeParameterDeclaration>): any;
  visitTSTypeParameterDeclaration?(this: Context & M, path: NodePath<N.TSTypeParameterDeclaration>): any;
  visitTypeParameterInstantiation?(this: Context & M, path: NodePath<N.TypeParameterInstantiation>): any;
  visitTSTypeParameterInstantiation?(this: Context & M, path: NodePath<N.TSTypeParameterInstantiation>): any;
  visitClassImplements?(this: Context & M, path: NodePath<N.ClassImplements>): any;
  visitTSType?(this: Context & M, path: NodePath<N.TSType>): any;
  visitTSExpressionWithTypeArguments?(this: Context & M, path: NodePath<N.TSExpressionWithTypeArguments>): any;
  visitFlow?(this: Context & M, path: NodePath<N.Flow>): any;
  visitFlowType?(this: Context & M, path: NodePath<N.FlowType>): any;
  visitAnyTypeAnnotation?(this: Context & M, path: NodePath<N.AnyTypeAnnotation>): any;
  visitEmptyTypeAnnotation?(this: Context & M, path: NodePath<N.EmptyTypeAnnotation>): any;
  visitMixedTypeAnnotation?(this: Context & M, path: NodePath<N.MixedTypeAnnotation>): any;
  visitVoidTypeAnnotation?(this: Context & M, path: NodePath<N.VoidTypeAnnotation>): any;
  visitNumberTypeAnnotation?(this: Context & M, path: NodePath<N.NumberTypeAnnotation>): any;
  visitNumberLiteralTypeAnnotation?(this: Context & M, path: NodePath<N.NumberLiteralTypeAnnotation>): any;
  visitNumericLiteralTypeAnnotation?(this: Context & M, path: NodePath<N.NumericLiteralTypeAnnotation>): any;
  visitStringTypeAnnotation?(this: Context & M, path: NodePath<N.StringTypeAnnotation>): any;
  visitStringLiteralTypeAnnotation?(this: Context & M, path: NodePath<N.StringLiteralTypeAnnotation>): any;
  visitBooleanTypeAnnotation?(this: Context & M, path: NodePath<N.BooleanTypeAnnotation>): any;
  visitBooleanLiteralTypeAnnotation?(this: Context & M, path: NodePath<N.BooleanLiteralTypeAnnotation>): any;
  visitNullableTypeAnnotation?(this: Context & M, path: NodePath<N.NullableTypeAnnotation>): any;
  visitNullLiteralTypeAnnotation?(this: Context & M, path: NodePath<N.NullLiteralTypeAnnotation>): any;
  visitNullTypeAnnotation?(this: Context & M, path: NodePath<N.NullTypeAnnotation>): any;
  visitThisTypeAnnotation?(this: Context & M, path: NodePath<N.ThisTypeAnnotation>): any;
  visitExistsTypeAnnotation?(this: Context & M, path: NodePath<N.ExistsTypeAnnotation>): any;
  visitExistentialTypeParam?(this: Context & M, path: NodePath<N.ExistentialTypeParam>): any;
  visitFunctionTypeAnnotation?(this: Context & M, path: NodePath<N.FunctionTypeAnnotation>): any;
  visitFunctionTypeParam?(this: Context & M, path: NodePath<N.FunctionTypeParam>): any;
  visitArrayTypeAnnotation?(this: Context & M, path: NodePath<N.ArrayTypeAnnotation>): any;
  visitObjectTypeAnnotation?(this: Context & M, path: NodePath<N.ObjectTypeAnnotation>): any;
  visitObjectTypeProperty?(this: Context & M, path: NodePath<N.ObjectTypeProperty>): any;
  visitObjectTypeSpreadProperty?(this: Context & M, path: NodePath<N.ObjectTypeSpreadProperty>): any;
  visitObjectTypeIndexer?(this: Context & M, path: NodePath<N.ObjectTypeIndexer>): any;
  visitObjectTypeCallProperty?(this: Context & M, path: NodePath<N.ObjectTypeCallProperty>): any;
  visitObjectTypeInternalSlot?(this: Context & M, path: NodePath<N.ObjectTypeInternalSlot>): any;
  visitVariance?(this: Context & M, path: NodePath<N.Variance>): any;
  visitQualifiedTypeIdentifier?(this: Context & M, path: NodePath<N.QualifiedTypeIdentifier>): any;
  visitGenericTypeAnnotation?(this: Context & M, path: NodePath<N.GenericTypeAnnotation>): any;
  visitMemberTypeAnnotation?(this: Context & M, path: NodePath<N.MemberTypeAnnotation>): any;
  visitUnionTypeAnnotation?(this: Context & M, path: NodePath<N.UnionTypeAnnotation>): any;
  visitIntersectionTypeAnnotation?(this: Context & M, path: NodePath<N.IntersectionTypeAnnotation>): any;
  visitTypeofTypeAnnotation?(this: Context & M, path: NodePath<N.TypeofTypeAnnotation>): any;
  visitType?(this: Context & M, path: NodePath<N.Type>): any;
  visitTypeParameter?(this: Context & M, path: NodePath<N.TypeParameter>): any;
  visitClassPrivateProperty?(this: Context & M, path: NodePath<N.ClassPrivateProperty>): any;
  visitInterfaceTypeAnnotation?(this: Context & M, path: NodePath<N.InterfaceTypeAnnotation>): any;
  visitInterfaceExtends?(this: Context & M, path: NodePath<N.InterfaceExtends>): any;
  visitInterfaceDeclaration?(this: Context & M, path: NodePath<N.InterfaceDeclaration>): any;
  visitDeclareInterface?(this: Context & M, path: NodePath<N.DeclareInterface>): any;
  visitTypeAlias?(this: Context & M, path: NodePath<N.TypeAlias>): any;
  visitOpaqueType?(this: Context & M, path: NodePath<N.OpaqueType>): any;
  visitDeclareTypeAlias?(this: Context & M, path: NodePath<N.DeclareTypeAlias>): any;
  visitDeclareOpaqueType?(this: Context & M, path: NodePath<N.DeclareOpaqueType>): any;
  visitTypeCastExpression?(this: Context & M, path: NodePath<N.TypeCastExpression>): any;
  visitTupleTypeAnnotation?(this: Context & M, path: NodePath<N.TupleTypeAnnotation>): any;
  visitDeclareVariable?(this: Context & M, path: NodePath<N.DeclareVariable>): any;
  visitDeclareFunction?(this: Context & M, path: NodePath<N.DeclareFunction>): any;
  visitDeclareClass?(this: Context & M, path: NodePath<N.DeclareClass>): any;
  visitDeclareModule?(this: Context & M, path: NodePath<N.DeclareModule>): any;
  visitDeclareModuleExports?(this: Context & M, path: NodePath<N.DeclareModuleExports>): any;
  visitDeclareExportDeclaration?(this: Context & M, path: NodePath<N.DeclareExportDeclaration>): any;
  visitExportSpecifier?(this: Context & M, path: NodePath<N.ExportSpecifier>): any;
  visitExportBatchSpecifier?(this: Context & M, path: NodePath<N.ExportBatchSpecifier>): any;
  visitDeclareExportAllDeclaration?(this: Context & M, path: NodePath<N.DeclareExportAllDeclaration>): any;
  visitFlowPredicate?(this: Context & M, path: NodePath<N.FlowPredicate>): any;
  visitInferredPredicate?(this: Context & M, path: NodePath<N.InferredPredicate>): any;
  visitDeclaredPredicate?(this: Context & M, path: NodePath<N.DeclaredPredicate>): any;
  visitExportDeclaration?(this: Context & M, path: NodePath<N.ExportDeclaration>): any;
  visitBlock?(this: Context & M, path: NodePath<N.Block>): any;
  visitLine?(this: Context & M, path: NodePath<N.Line>): any;
  visitNoop?(this: Context & M, path: NodePath<N.Noop>): any;
  visitDoExpression?(this: Context & M, path: NodePath<N.DoExpression>): any;
  visitSuper?(this: Context & M, path: NodePath<N.Super>): any;
  visitBindExpression?(this: Context & M, path: NodePath<N.BindExpression>): any;
  visitDecorator?(this: Context & M, path: NodePath<N.Decorator>): any;
  visitMetaProperty?(this: Context & M, path: NodePath<N.MetaProperty>): any;
  visitParenthesizedExpression?(this: Context & M, path: NodePath<N.ParenthesizedExpression>): any;
  visitExportDefaultDeclaration?(this: Context & M, path: NodePath<N.ExportDefaultDeclaration>): any;
  visitExportNamedDeclaration?(this: Context & M, path: NodePath<N.ExportNamedDeclaration>): any;
  visitExportNamespaceSpecifier?(this: Context & M, path: NodePath<N.ExportNamespaceSpecifier>): any;
  visitExportDefaultSpecifier?(this: Context & M, path: NodePath<N.ExportDefaultSpecifier>): any;
  visitExportAllDeclaration?(this: Context & M, path: NodePath<N.ExportAllDeclaration>): any;
  visitCommentBlock?(this: Context & M, path: NodePath<N.CommentBlock>): any;
  visitCommentLine?(this: Context & M, path: NodePath<N.CommentLine>): any;
  visitDirective?(this: Context & M, path: NodePath<N.Directive>): any;
  visitDirectiveLiteral?(this: Context & M, path: NodePath<N.DirectiveLiteral>): any;
  visitInterpreterDirective?(this: Context & M, path: NodePath<N.InterpreterDirective>): any;
  visitStringLiteral?(this: Context & M, path: NodePath<N.StringLiteral>): any;
  visitNumericLiteral?(this: Context & M, path: NodePath<N.NumericLiteral>): any;
  visitBigIntLiteral?(this: Context & M, path: NodePath<N.BigIntLiteral>): any;
  visitNullLiteral?(this: Context & M, path: NodePath<N.NullLiteral>): any;
  visitBooleanLiteral?(this: Context & M, path: NodePath<N.BooleanLiteral>): any;
  visitRegExpLiteral?(this: Context & M, path: NodePath<N.RegExpLiteral>): any;
  visitObjectMethod?(this: Context & M, path: NodePath<N.ObjectMethod>): any;
  visitClassMethod?(this: Context & M, path: NodePath<N.ClassMethod>): any;
  visitClassPrivateMethod?(this: Context & M, path: NodePath<N.ClassPrivateMethod>): any;
  visitPrivateName?(this: Context & M, path: NodePath<N.PrivateName>): any;
  visitRestProperty?(this: Context & M, path: NodePath<N.RestProperty>): any;
  visitForAwaitStatement?(this: Context & M, path: NodePath<N.ForAwaitStatement>): any;
  visitImport?(this: Context & M, path: NodePath<N.Import>): any;
  visitTSQualifiedName?(this: Context & M, path: NodePath<N.TSQualifiedName>): any;
  visitTSTypeReference?(this: Context & M, path: NodePath<N.TSTypeReference>): any;
  visitTSHasOptionalTypeParameters?(this: Context & M, path: NodePath<N.TSHasOptionalTypeParameters>): any;
  visitTSHasOptionalTypeAnnotation?(this: Context & M, path: NodePath<N.TSHasOptionalTypeAnnotation>): any;
  visitTSAsExpression?(this: Context & M, path: NodePath<N.TSAsExpression>): any;
  visitTSNonNullExpression?(this: Context & M, path: NodePath<N.TSNonNullExpression>): any;
  visitTSAnyKeyword?(this: Context & M, path: NodePath<N.TSAnyKeyword>): any;
  visitTSBooleanKeyword?(this: Context & M, path: NodePath<N.TSBooleanKeyword>): any;
  visitTSNeverKeyword?(this: Context & M, path: NodePath<N.TSNeverKeyword>): any;
  visitTSNullKeyword?(this: Context & M, path: NodePath<N.TSNullKeyword>): any;
  visitTSNumberKeyword?(this: Context & M, path: NodePath<N.TSNumberKeyword>): any;
  visitTSObjectKeyword?(this: Context & M, path: NodePath<N.TSObjectKeyword>): any;
  visitTSStringKeyword?(this: Context & M, path: NodePath<N.TSStringKeyword>): any;
  visitTSSymbolKeyword?(this: Context & M, path: NodePath<N.TSSymbolKeyword>): any;
  visitTSUndefinedKeyword?(this: Context & M, path: NodePath<N.TSUndefinedKeyword>): any;
  visitTSUnknownKeyword?(this: Context & M, path: NodePath<N.TSUnknownKeyword>): any;
  visitTSVoidKeyword?(this: Context & M, path: NodePath<N.TSVoidKeyword>): any;
  visitTSThisType?(this: Context & M, path: NodePath<N.TSThisType>): any;
  visitTSArrayType?(this: Context & M, path: NodePath<N.TSArrayType>): any;
  visitTSLiteralType?(this: Context & M, path: NodePath<N.TSLiteralType>): any;
  visitTSUnionType?(this: Context & M, path: NodePath<N.TSUnionType>): any;
  visitTSIntersectionType?(this: Context & M, path: NodePath<N.TSIntersectionType>): any;
  visitTSConditionalType?(this: Context & M, path: NodePath<N.TSConditionalType>): any;
  visitTSInferType?(this: Context & M, path: NodePath<N.TSInferType>): any;
  visitTSTypeParameter?(this: Context & M, path: NodePath<N.TSTypeParameter>): any;
  visitTSParenthesizedType?(this: Context & M, path: NodePath<N.TSParenthesizedType>): any;
  visitTSFunctionType?(this: Context & M, path: NodePath<N.TSFunctionType>): any;
  visitTSConstructorType?(this: Context & M, path: NodePath<N.TSConstructorType>): any;
  visitTSDeclareFunction?(this: Context & M, path: NodePath<N.TSDeclareFunction>): any;
  visitTSDeclareMethod?(this: Context & M, path: NodePath<N.TSDeclareMethod>): any;
  visitTSMappedType?(this: Context & M, path: NodePath<N.TSMappedType>): any;
  visitTSTupleType?(this: Context & M, path: NodePath<N.TSTupleType>): any;
  visitTSRestType?(this: Context & M, path: NodePath<N.TSRestType>): any;
  visitTSOptionalType?(this: Context & M, path: NodePath<N.TSOptionalType>): any;
  visitTSIndexedAccessType?(this: Context & M, path: NodePath<N.TSIndexedAccessType>): any;
  visitTSTypeOperator?(this: Context & M, path: NodePath<N.TSTypeOperator>): any;
  visitTSIndexSignature?(this: Context & M, path: NodePath<N.TSIndexSignature>): any;
  visitTSPropertySignature?(this: Context & M, path: NodePath<N.TSPropertySignature>): any;
  visitTSMethodSignature?(this: Context & M, path: NodePath<N.TSMethodSignature>): any;
  visitTSTypePredicate?(this: Context & M, path: NodePath<N.TSTypePredicate>): any;
  visitTSCallSignatureDeclaration?(this: Context & M, path: NodePath<N.TSCallSignatureDeclaration>): any;
  visitTSConstructSignatureDeclaration?(this: Context & M, path: NodePath<N.TSConstructSignatureDeclaration>): any;
  visitTSEnumMember?(this: Context & M, path: NodePath<N.TSEnumMember>): any;
  visitTSTypeQuery?(this: Context & M, path: NodePath<N.TSTypeQuery>): any;
  visitTSTypeLiteral?(this: Context & M, path: NodePath<N.TSTypeLiteral>): any;
  visitTSTypeAssertion?(this: Context & M, path: NodePath<N.TSTypeAssertion>): any;
  visitTSEnumDeclaration?(this: Context & M, path: NodePath<N.TSEnumDeclaration>): any;
  visitTSTypeAliasDeclaration?(this: Context & M, path: NodePath<N.TSTypeAliasDeclaration>): any;
  visitTSModuleBlock?(this: Context & M, path: NodePath<N.TSModuleBlock>): any;
  visitTSModuleDeclaration?(this: Context & M, path: NodePath<N.TSModuleDeclaration>): any;
  visitTSImportEqualsDeclaration?(this: Context & M, path: NodePath<N.TSImportEqualsDeclaration>): any;
  visitTSExternalModuleReference?(this: Context & M, path: NodePath<N.TSExternalModuleReference>): any;
  visitTSExportAssignment?(this: Context & M, path: NodePath<N.TSExportAssignment>): any;
  visitTSNamespaceExportDeclaration?(this: Context & M, path: NodePath<N.TSNamespaceExportDeclaration>): any;
  visitTSInterfaceBody?(this: Context & M, path: NodePath<N.TSInterfaceBody>): any;
  visitTSInterfaceDeclaration?(this: Context & M, path: NodePath<N.TSInterfaceDeclaration>): any;
  visitTSParameterProperty?(this: Context & M, path: NodePath<N.TSParameterProperty>): any;
  visitOptionalMemberExpression?(this: Context & M, path: NodePath<N.OptionalMemberExpression>): any;
  visitOptionalCallExpression?(this: Context & M, path: NodePath<N.OptionalCallExpression>): any;
}
import { CallExpression } from '@swc/core'
import { Visitor } from '@swc/core/Visitor.js'

export class InjectDefineConfigHeader extends Visitor {
  visitTsType (expression) {
    return expression
  }

  visitCallExpression (expression: CallExpression) {
    const callee = expression.callee
    if (callee.type === 'Identifier' && (callee.value === 'definePageConfig' || callee.value === 'defineAppConfig')) {
      return expression.arguments[0].expression
    }

    return expression
  }
}

interface ICreateSwcRegisterParam {
  only
  plugin?
}

export default function createSwcRegister ({ only, plugin }: ICreateSwcRegisterParam) {
  const config: Record<string, any> = {
    only: Array.from(new Set([...only])),
    jsc: {
      parser: {
        syntax: 'typescript',
        decorators: true
      },
      transform: {
        legacyDecorator: true
      }
    },
    module: {
      type: 'commonjs'
    }
  }

  if (plugin) config.plugin = plugin

  require('@swc/register')(config)
}

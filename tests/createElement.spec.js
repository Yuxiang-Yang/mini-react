import { it, expect, describe } from 'vitest'
import React from '../core/React'
describe('createElement', () => {
  it('prop is null', () => {
    const el = React.createElement('div', null, 'hi')
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)
  })
  it('should return element vdom', () => {
    const el = React.createElement('div', { id: 'app', className: 'container' }, 'hello')
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "className": "container",
          "id": "app",
        },
        "type": "div",
      }
    `)
  })
})

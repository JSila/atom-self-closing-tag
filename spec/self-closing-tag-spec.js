'use babel';

describe('SelfClosingTag', () => {
  let editor, workspaceElement, editorView;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() => {
      return atom.workspace.open('example.html').then(e => {
        editor = e
      })
    })

    waitsForPromise(() => {
      return atom.packages.activatePackage('language-html')
    })

    waitsForPromise(() => {
      return atom.packages.activatePackage('self-closing-tag')
    })
  })

  let testCases = [
    {
      description: 'deletes closing tag',
      text: '<span><span>',
      curPos: 5,
      actual: '<span/>'
    },
    {
      description: 'deletes closing tag if space inserted before slash',
      text: '<span ><span>',
      curPos: 6,
      actual: '<span />'
    },
    {
      description: 'preserves attributes from opening tag',
      text: '<span class="like" ><span>',
      curPos: 19,
      actual: '<span class="like" />'
    },
    {
      description: 'preserves text that follows after closing tag',
      text: '<span class="like"></span> is something.',
      curPos: 18,
      actual: '<span class="like"/> is something.'
    }
  ]

  testCases.forEach(t => {
    it(t.description, () => {
      editor.setText(t.text)
      editor.setCursorBufferPosition([, t.curPos])
      editor.insertText('/')

      expect(editor.getText()).toBe(t.actual)
    })
  })
})

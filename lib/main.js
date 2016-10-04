'use babel';

import { CompositeDisposable } from 'atom';
import SelfClosingTag from './self-closing-tag'

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.workspace.observeTextEditors(editor => {

      let editorScope = editor.getRootScopeDescriptor().getScopesArray()

      if (!editorScope && !editorScope.length) return

      if (!/text\.html|source\.js\.jsx/.test(editorScope[0])) return

      let selfClosingTag = SelfClosingTag(editor)

      selfClosingTag.watchForTag()

      editor.onDidDestroy(() => selfClosingTag.destroy())
    }))
  },

  deactivate() {
    this.subscriptions.dispose();
  },
};

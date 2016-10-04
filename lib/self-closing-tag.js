'use babel';

import { CompositeDisposable, Range, Point } from 'atom';

export default function(editor) {
  let subscriptions = new CompositeDisposable();

  const destroy = () => subscriptions.dispose();

  const watchForTag = () => {
    subscriptions.add(editor.onDidInsertText(e => {
      if (e.text != '/') return;

      let pos = editor.getCursorBufferPosition(),
        char = editor.getTextInBufferRange([
          pos,
          new Point(pos.row, pos.column + 1)
        ]);

      if (char != '>') return;

      let cursor = editor.getCursors()[0],
        buffer = editor.getBuffer(),
        tag = '',
        tagName = '',
        startPoint = {},
        endPoint = {};

      startPoint = cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: /<[a-z]+/i
      });
      tag = buffer.getTextInRange(new Range(startPoint, e.range.start));
      tagName = tag.split(' ')[0].substring(1);

      startPoint.column = e.range.end.column + 1;
      endPoint = new Point(
        startPoint.row,
        startPoint.column + tagName.length + 3
      );

      buffer.delete(new Range(startPoint, endPoint))
    }))
  };

  return { destroy, watchForTag }
}

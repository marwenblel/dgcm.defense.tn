/**
 * @module tweetable-text
 */

import { Command } from 'ckeditor5/src/core';

/**
 * The remove tab command.
 *
 * @extends module:core/command~Command
 */

export default class BootstrapTabsRemoveTabCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'bootstrapTabs' );
    this.isEnabled = allowedIn !== null;
  }

  execute({id}) {
    const model = this.editor.model;
    const selection = model.document.selection;
    const selectedElement = selection.getSelectedElement();

    model.change( writer => {
      for (const child of selectedElement.getChildren()) {
        if (child.name === 'bootstrapTabWrapper') {
          for (const descendant of child.getChildren()) {
            if (descendant.getAttribute('target-id') === id) {
              writer.remove(descendant);
            }
          }
        }
        if (child.name === 'bootstrapTabContentWrapper') {
          for (const descendant of child.getChildren()) {
            if (descendant.getAttribute('id') === id) {
              writer.remove(descendant);
            }
          }
        }
      }
    });
  }

}

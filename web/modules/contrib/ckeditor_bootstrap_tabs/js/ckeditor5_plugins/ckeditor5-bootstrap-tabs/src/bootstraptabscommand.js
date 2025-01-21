/**
 * @module tweetable-text
 */

import { Command } from 'ckeditor5/src/core';
import { makeSafeForCSS } from "./utils";

/**
 * The insert tweetable text command.
 * The command is registered by the {@link module:tweetable-text/bootstraptabsediting~BootstrapTabsEditing} as `'bootstrapTabs'`.
 * To insert tweetable text at the current selection, execute the command, specify the display text and tweetable text value:
 *		editor.execute( 'bootstrapTabs', 'My display text', 'My tweeted text' );
 *
 * @extends module:core/command~Command
 */

export default class BootstrapTabsCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'bootstrapTabs' );
    this.isEnabled = allowedIn !== null;
  }

  execute({title, numTabs}) {
    const model = this.editor.model;
    const selection = model.document.selection;
    const selectedElement = selection.getSelectedElement();

    if (numTabs < 2) {
      numTabs = 2;
    }

    model.change( writer => {
      if (selectedElement && selectedElement.name === 'bootstrapTabs') {
        let currentNumTabs = 0;
        const tabIdPrefix = makeSafeForCSS(selectedElement.getAttribute('tab-set-title'));
        if (currentNumTabs < numTabs) {
          for (const child of selectedElement.getChildren()) {
            if (child.name === 'bootstrapTabWrapper') {
              for (const grandchild of child.getChildren()) {
                currentNumTabs++;
              }
              for (let i = currentNumTabs; i < numTabs; i++) {
                this.appendEmptyTab(child, i, writer, tabIdPrefix);
              }
            }
            else if (child.name === 'bootstrapTabContentWrapper') {
              for (let i = currentNumTabs; i < numTabs; i++) {
                this.appendEmptyTabContent(child, i, writer, tabIdPrefix);
              }
            }
          }
        }
      }
      else {
        const bootstrapTabs = writer.createElement('bootstrapTabs', {
          'tab-set-title': title,
        } );

        const bootstrapTabWrapper = writer.createElement('bootstrapTabWrapper');
        const bootstrapTabContentWrapper = writer.createElement('bootstrapTabContentWrapper');
        const tabIdPrefix = makeSafeForCSS(bootstrapTabs.getAttribute('tab-set-title'));

        for (let i = 0; i < numTabs; i++) {
          this.appendEmptyTab(bootstrapTabWrapper, i, writer, tabIdPrefix);
        }
        for (let i = 0; i < numTabs; i++) {
          this.appendEmptyTabContent(bootstrapTabContentWrapper, i, writer, tabIdPrefix);
        }
        writer.insert(
          bootstrapTabWrapper,
          writer.createPositionAt(bootstrapTabs, 'end')
        );
        writer.insert(
          bootstrapTabContentWrapper,
          writer.createPositionAt(bootstrapTabs, 'end')
        );
        model.insertObject(
          bootstrapTabs
        );
      }
    });
  }

  appendEmptyTab(parent, index, writer, tabIdPrefix) {
    const tabId = tabIdPrefix + '-tab-' + index + '-name';
    const bootstrapTab = writer.createElement('bootstrapTab', {
      'is-active': index === 0,
      'target-id': tabId,
    });
    writer.insert(
      writer.createText(
        'Tab ' + index + ' Name',
        {
          bootstrapTabFor: tabId,
        },
      ),
      writer.createPositionAt(bootstrapTab, 'end'),
    );
    writer.insert(bootstrapTab, writer.createPositionAt(parent, 'end'));
  }

  appendEmptyTabContent(parent, index, writer, tabIdPrefix) {
    const bootstrapTabContentPane = writer.createElement('bootstrapTabContentPane', {
      'is-active': index === 0,
      'id': tabIdPrefix + '-tab-' + index + '-name',
    });
    const bootstrapTabContent = writer.createElement('bootstrapTabContent');
    const bootstrapTabContentParagraph = writer.createElement('paragraph');
    writer.insert(
      writer.createText(
        'Tab ' + index + ' Content',
      ),
      writer.createPositionAt(bootstrapTabContentParagraph, 'end'),
    );
    writer.insert(
      bootstrapTabContentParagraph,
      writer.createPositionAt(bootstrapTabContent, 'end'),
    );
    writer.insert(
      bootstrapTabContent,
      writer.createPositionAt(bootstrapTabContentPane, 'end'),
    );
    writer.insert(
      bootstrapTabContentPane,
      writer.createPositionAt(parent, 'end'),
    );
  }

}

/**
 * @module tweetable-text
 */

import { Plugin } from 'ckeditor5/src/core';
import {
  ButtonView,
  ContextualBalloon,
  clickOutsideHandler,
} from 'ckeditor5/src/ui';
import BootstrapTabsFormView from './bootstraptabsformview';
import bootstrapTabsIcon from '../theme/icons/bootstrapTabs.svg';
import { ClickObserver } from 'ckeditor5/src/engine';
import BootstrapTabFormView from "./bootstraptabformview";

/**
 * The tweetable text UI plugin.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BootstrapTabsUI extends Plugin {

  /**
   * @inheritdoc
   */
  static get requires() {
    return [ContextualBalloon];
  }

  /**
   * @inheritdoc
   */
	init() {
      const editor = this.editor;

      this._balloon = this.editor.plugins.get(ContextualBalloon);
      this.formView = this._createFormView();
      this.tabFormView = this._createTabFormView();

      editor.ui.componentFactory.add( 'bootstrapTabs', () => {
        const button = new ButtonView();

        button.set({
          label: 'Bootstrap Tabs',
          icon: bootstrapTabsIcon,
          tooltip: true,
        });

        this.listenTo(button, 'execute', () => {
          this._showUI();
        });

        return button;
      });

      editor.editing.view.addObserver( ClickObserver );
      const viewDocument = this.editor.editing.view.document;
      this.listenTo(viewDocument, 'click', (event, data) => {
          let model = editor.editing.mapper.toModelElement(data.target);
          if (!model) {
            model = editor.editing.mapper.toModelElement(data.target.parent);
          }
          if (model && model.name === 'bootstrapTab') {
            // When clicking an active tab we open the UI for editing or removing it.
            if (model.getAttribute('is-active')) {
              this.tabFormView.tabId = model.getAttribute('target-id');
              this.tabFormView.titleInputView.fieldView.value = model.getChild(0).data;
              this._showTabUi();
            }
            // When clicking an inactive tab we switch it to the active tab.
            else {
                    editor.model.change( writer => {
                        const bootstrapTabs = model.parent.parent;
                        for (const wrapper of bootstrapTabs.getChildren()) {
                            if (wrapper.name === 'bootstrapTabWrapper') {
                                for (const tab of wrapper.getChildren()) {
                                    if (tab.name === 'bootstrapTab') {
                                        writer.setAttribute('is-active', tab === model, tab);
                                    }
                                }
                            }
                            if (wrapper.name === 'bootstrapTabContentWrapper') {
                                for (const tabContentPane of wrapper.getChildren()) {
                                    if (tabContentPane.name === 'bootstrapTabContentPane') {
                                        writer.setAttribute('is-active', tabContentPane.getAttribute('id') === model.getAttribute('target-id'), tabContentPane);
                                    }
                                }
                            }
                        }
                    });
                }
            }
          else if (model && model.name === 'bootstrapTabs') {
            this._showUI();
          }
      });
	}

  _createFormView() {
    const editor = this.editor;
    const formView = new BootstrapTabsFormView(editor.locale);

    this.listenTo(formView, 'submit', () => {
      const values = {
        title: formView.titleInputView.fieldView.element.value,
        numTabs: formView.tabsNumView.fieldView.element.value,
      };
      editor.execute('addBootstrapTabs', values);
      this._hideUI();
    });

    this.listenTo(formView, 'cancel', () => {
      this._hideUI();
    });

    clickOutsideHandler( {
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI()
    });

    formView.keystrokes.set('Esc', (data, cancel) => {
      this._hideUI();
      cancel();
    });

    return formView;
  }

  _createTabFormView() {
      const editor = this.editor;
      const formView = new BootstrapTabFormView(editor.locale);

      this.listenTo(formView, 'submit', () => {
          editor.execute(
          'renameBootstrapTab', {
              id: formView.tabId,
              title: formView.titleInputView.fieldView.element.value,
          });
          this._hideTabUI();
      });
      this.listenTo(formView.removeButtonView, 'execute', (event) => {
          editor.execute('removeBootstrapTab', {
            id: formView.tabId,
          });
          this._hideTabUI();
      });

      this.listenTo(formView, 'cancel', () => {
          this._hideTabUI();
      });

      clickOutsideHandler( {
          emitter: formView,
          activator: () => this._balloon.visibleView === formView,
          contextElements: [this._balloon.view.element],
          callback: () => this._hideTabUI()
      });

      formView.keystrokes.set('Esc', (data, cancel) => {
          this._hideTabUI();
          cancel();
      });

      return formView;
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;
    target = () => view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange()
    );

    return {
      target
    };
  }

  _showUI() {
    const selection = this.editor.model.document.selection;

    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData()
    });

    const selectedElement = selection.getSelectedElement();
    if (selectedElement && selectedElement.name === 'bootstrapTabs') {
      this.formView.titleInputView.fieldView.value = selectedElement.getAttribute('tab-set-title');
      let numTabs = 0;
      for (const child of selectedElement.getChildren()) {
        if (child.name === 'bootstrapTabWrapper') {
          for (const descendant of child.getChildren()) {
            numTabs++;
          }
        }
      }
      this.formView.tabsNumView.fieldView.value = numTabs;
    }
    this.formView.focus();
  }

  _showTabUi() {
      this._balloon.add({
          view: this.tabFormView,
          position: this._getBalloonPositionData()
      });
      this.tabFormView.focus();
  }

  _hideUI() {
    this.formView.titleInputView.fieldView.value = '';
    this.formView.element.reset();
    this._balloon.remove(this.formView);
    this.editor.editing.view.focus();
  }

  _hideTabUI() {
    this.tabFormView.tabId = null;
    this.tabFormView.titleInputView.fieldView.value = '';
    this.tabFormView.element.reset();
    this._balloon.remove(this.tabFormView);
    this.editor.editing.view.focus();
  }

}

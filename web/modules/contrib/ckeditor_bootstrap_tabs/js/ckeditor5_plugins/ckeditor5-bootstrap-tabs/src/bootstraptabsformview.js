/**
 * @module tweetable-text
 */

import {
	ButtonView,
	LabeledFieldView,
	View,
	createLabeledInputText,
  createDropdown,
  submitHandler,
  FocusCycler,
} from 'ckeditor5/src/ui';
import {
  FocusTracker,
  KeystrokeHandler,
} from 'ckeditor5/src/utils';

import { icons } from 'ckeditor5/src/core';
import '@ckeditor/ckeditor5-ui/theme/components/responsive-form/responsiveform.css';
import {createInput, createButton} from "./utils";

/**
 * The form view for the bootstrap tabs container.
 *
 * See {@link module:tweetable-text/bootstraptabsformview~BootstrapTabsFormView}.
 *
 * @extends module:ui/view~View
 */
export default class BootstrapTabsFormView extends View {
	/**
	 * @param {Array.<Function>} validators Form validators used by {@link #isValid}.
	 * @param {module:utils/locale~Locale} [locale] The localization services instance.
	 */
	constructor(locale) {
		super(locale);

    this.titleInputView = createInput(this.locale, 'Set Tabs Title');

    this.tabsNumView = this._tabsNumView();

    this.saveButtonView = createButton('Save', icons.check, 'ck-button-save');
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = createButton('Cancel', icons.cancel, 'ck-button-cancel');
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    this.childViews = this.createCollection([
      this.titleInputView,
      this.tabsNumView,
      this.saveButtonView,
      this.cancelButtonView
    ]);

    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();

    this._focusCycler = new FocusCycler({
      focusables: this.childViews,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        focusPrevious: 'shift + tab',
        focusNext: 'tab'
      }
    });

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-responsive-form', 'bt-form'],
      },
      children: this.childViews
    });
	}

  render() {
    super.render();
    submitHandler({
      view: this
    });

    this.childViews._items.forEach(view => {
      this.focusTracker.add(view.element);
    });

    this.keystrokes.listenTo(this.element);
  }

  destroy() {
    super.destroy();
    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }

  focus() {
    this.titleInputView.focus();
  }

  _tabsNumView() {
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
    labeledInput.label = 'Num Of Tabs (min 2)';
    return labeledInput;
  }

}

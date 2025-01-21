/**
 * @module tweetable-text
 */

import { Plugin } from 'ckeditor5/src/core';

import BootstrapTabsEditing from './bootstraptabsediting';
import BootstrapTabsUI from './bootstraptabsui';

/**
 * The tweetable text plugin.
 *
 * This is a "glue" plugin which loads the following plugins:
 *
 * * The {@link module:tweetable-text/bootstraptabsediting~BootstrapTabsEditing tweetable text adding feature} and
 * * The {@link module:tweetable-text/bootstraptabsui~BootstrapTabsUI tweetable text UI feature}
 *
 * @extends module:core/plugin~Plugin
 */
export default class BootstrapTabs extends Plugin {
	/**
     * @inheritDoc
     */
	static get requires() {
		return [
      BootstrapTabsEditing,
      BootstrapTabsUI
    ];
	}

	/**
     * @inheritDoc
     */
	static get pluginName() {
		return 'BootstrapTabs';
	}
}

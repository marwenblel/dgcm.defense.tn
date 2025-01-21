/**
 * @module tweetable-text
 */

import { Plugin } from 'ckeditor5/src/core';
import BootstrapTabsCommand from './bootstraptabscommand';
import {
    downcastBootstrapTab,
    downcastBootstrapTabContent,
    downcastBootstrapTabFor,
    downcastBootstrapTabs, downcastRemoveBootstrapTab
} from "./converters/downcast";
import {upcastBootstrapTab, upcastBootstrapTabContent, upcastBootstrapTabs} from "./converters/upcast";
import BootstrapTabsRemoveTabCommand from "./bootstraptabsremovetabcommand";
import BootstrapTabsRenameTabCommand from "./bootstraptabsrenametabcommand";
import { toWidgetEditable } from 'ckeditor5/src/widget';

/**
 * The tweetable text editing feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BootstrapTabsEditing extends Plugin {

	/**
	 * @inheritdoc
	 */
	init() {
		this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('addBootstrapTabs', new BootstrapTabsCommand(this.editor));
    this.editor.commands.add('removeBootstrapTab', new BootstrapTabsRemoveTabCommand(this.editor));
    this.editor.commands.add('renameBootstrapTab', new BootstrapTabsRenameTabCommand(this.editor));
	}

	/**
	 * Defines schema for the plugin.
	 */
	_defineSchema() {
      const schema = this.editor.model.schema;

      schema.register('bootstrapTabs', {
        inheritAllFrom: '$blockObject',
        allowAttributes: [
          'tab-set-title',
        ],
      } );
      schema.register('bootstrapTabWrapper', {
        allowIn: 'bootstrapTabs',
        isLimit: true,
      });
      schema.register('bootstrapTab', {
        isLimit: true,
        allowIn: 'bootstrapTabWrapper',
        allowContentOf: '$block',
        allowAttributes: [
          'is-active',
          'target-id',
        ]
      } );
      schema.register('bootstrapTabContentWrapper', {
        allowIn: 'bootstrapTabs',
        isLimit: true,
      });
      schema.extend('$text', { allowAttributes: 'bootstrapTabFor' });
      schema.register('bootstrapTabContentPane', {
        isLimit: true,
        allowIn: 'bootstrapTabContentWrapper',
        allowAttributes: [
          'is-active',
          'id',
        ],
      });
      schema.register('bootstrapTabContent', {
        isLimit: true,
        allowIn: 'bootstrapTabContentPane',
        allowContentOf: '$root',
      } );
	}

  _defineConverters() {
    const conversion = this.editor.conversion;

    // Upcast for individual bootstrapTabs elements.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        classes: 'bootstrap-tabs',
      },
      model: (viewElement, { writer: writer }) => {
        return writer.createElement('bootstrapTabs', {
          'tab-set-title': viewElement.getAttribute('data-tab-set-title'),
        });
      }
    });

    // Editing downcast for top level bootstrapTabs elements.
    conversion.for( 'editingDowncast' ).elementToElement( {
      model: {
        name: 'bootstrapTabs',
        classes: ['bootstrap-tabs']
      },
      view: downcastBootstrapTabs( { asWidget: true })
    } );
    // conversion.for("editingDowncast").add( downcastRemoveBootstrapTab() );

    // Upcast for individual bootstrapTabWrapper elements.
    conversion.for( 'upcast' ).elementToElement( {
      view: {
        name: 'ul',
        classes: 'nav-tabs',
      },
      model: 'bootstrapTabWrapper',
      // So the list plugin doesn't consume the tag first.
      converterPriority: "high"
    });

    // Downcast for individual bootstrapTabWrapper elements.
    conversion.for( 'downcast' ).elementToElement( {
      model: 'bootstrapTabWrapper',
      view: ( modelElement, { writer: viewWriter } ) => {
        return viewWriter.createContainerElement(
            'ul',
            {
              class: 'nav nav-tabs',
              role: 'tablist',
            }
        );
      }
    } );

    // Data downcast for top level bootstrapTabs elements.
    conversion.for( 'dataDowncast' ).elementToStructure( {
      model: {
        name: 'bootstrapTabs',
        classes: ['bootstrap-tabs']
      },
      view: downcastBootstrapTabs( { asWidget: false } )
    } );

    // Upcast for individual bootstrapTab elements.
    conversion.for( 'upcast' ).add( upcastBootstrapTab() );

    // Downcasts for individual bootstrapTab elements.
    conversion.for( 'editingDowncast' ).elementToElement( {
      model: {
        name: 'bootstrapTab',
        attributes: [
          'is-active',
          'target-id',
        ]
      },
      view: downcastBootstrapTab( { asWidget: true } )
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
      model: {
        name: 'bootstrapTab',
        attributes: [
          'is-active',
          'target-id',
        ]
      },
      view: downcastBootstrapTab( { asWidget: false } )
    } );

    // Upcast for individual bootstrapTabFor attributes.
    conversion.for( 'upcast' ).elementToAttribute( {
      view: {
        name: 'a',
        attributes: {
          href: true,
          class: true,
          'aria-controls': true,
          'data-toggle': true,
          role: true,
        },
        classes: 'tab-link',
      },
      model: {
        key: 'bootstrapTabFor',
        value: viewElement => {
          return viewElement.getAttribute('href').replace('#', '');
        },
      },
      // So the link plugin doesn't consume the tag first.
      converterPriority: "high"
    });

    // Downcasts for individual bootstrapTabFor attributes.
    conversion.for( 'editingDowncast' ).attributeToElement( {
      model: 'bootstrapTabFor',
      view: downcastBootstrapTabFor(),
    });
    conversion.for( 'dataDowncast' ).attributeToElement( {
      model: 'bootstrapTabFor',
      view: downcastBootstrapTabFor(),
    });

    // Upcast for individual bootstrapTabContentWrapper elements.
    conversion.for( 'upcast' ).elementToElement( {
      view: {
        name: 'div',
        classes: 'tab-content',
      },
      model: 'bootstrapTabContentWrapper',
    });

    // Downcast for individual bootstrapTabContentWrapper elements.
    conversion.for( 'downcast' ).elementToElement( {
      model: 'bootstrapTabContentWrapper',
      view: ( modelElement, { writer: viewWriter } ) => {
        return viewWriter.createContainerElement(
            'div',
            {
              class: 'tab-content',
            }
        );
      }
    });

    // Upcast for individual bootstrapTabContentPane element.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        classes: 'tab-pane',
      },
      model: (viewElement, { writer: writer }) => {
        return writer.createElement('bootstrapTabContentPane', {
          'id': viewElement.getAttribute('id'),
          'is-active': viewElement.hasClass('active'),
        });
      }
    });

    // Downcast for individual bootstrapTabContentPane elements.
    conversion.for( 'downcast' ).elementToElement( {
      model: {
        name: 'bootstrapTabContentPane',
        attributes: [
          'is-active',
          'id'
        ]
      },
      view: ( modelElement, { writer: viewWriter } ) => {
        return viewWriter.createContainerElement(
          'div',
          {
            class: modelElement.getAttribute('is-active') ? 'tab-pane active' : 'tab-pane',
            role: 'tabpanel',
            id: modelElement.getAttribute('id'),
          }
        );
      }
    });

    // Upcast for individual bootstrapTabContent elements.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        classes: 'tab-pane-content',
      },
      model: (viewElement, { writer: writer }) => {
        return writer.createElement('bootstrapTabContent');
      }
    });

    // Downcasts for individual bootstrapTabContent elements.
    conversion.for( 'dataDowncast' ).elementToElement({
      model: {
        name: 'bootstrapTabContent',
      },
      view: ( modelElement, { writer: viewWriter } ) => {
        return viewWriter.createContainerElement(
          'div',
          {
            class: 'tab-pane-content',
          }
        );
      }
    });
    conversion.for( 'editingDowncast' ).elementToElement({
      model: {
        name: 'bootstrapTabContent',
      },
      view: ( modelElement, { writer: viewWriter } ) => {
        return toWidgetEditable(viewWriter.createEditableElement(
          'div',
          {
            class: 'tab-pane-content',
          }
        ), viewWriter);
      }
    });

  }

}

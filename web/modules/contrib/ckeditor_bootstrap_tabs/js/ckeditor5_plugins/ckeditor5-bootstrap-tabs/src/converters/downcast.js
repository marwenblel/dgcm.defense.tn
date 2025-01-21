import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import {ButtonView} from "ckeditor5/src/ui";
import pencil from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg';

export function downcastBootstrapTabs( options ) {
  return ( model, { writer: viewWriter } ) => {
    // Create the outer bootstrap tabs div and our tab links and tab content containers.

    let container_element_options = [];
    if ( ! options.asWidget ) {
      container_element_options.push(
        viewWriter.createSlot()
      );
    }
    const bootstrapTabsElement = viewWriter.createContainerElement(
      'div',
      {
        class: 'bootstrap-tabs',
        "data-tab-set-title": model.getAttribute('tab-set-title')
      },
      container_element_options
    );

    if ( options.asWidget ) {
      return toWidget(bootstrapTabsElement, viewWriter, { label: 'Bootstrap Tabs widget' });
    }
    else {
      return bootstrapTabsElement;
    }

  }
}

export function downcastBootstrapTab( options ) {
  return ( model, { writer: viewWriter } ) => {
    // Create the bootstrap tab.
    const liClass = model.getAttribute('is-active') ? 'active' : '';
    const liElement = viewWriter.createContainerElement(
      'li',
      { role: 'presentation'}
    );
    if ( liClass ) {
      viewWriter.addClass( liClass, liElement );
    }
    return liElement;
  }
}

export function downcastBootstrapTabFor( ) {
  return ( modelAttributeValue, { writer } ) => {
    return writer.createAttributeElement( 'a', {
      'class': 'tab-link',
      href: '#' + modelAttributeValue,
      'aria-controls': modelAttributeValue,
      'data-toggle': 'tab',
      role: 'tab',
    } );
  }
}

export function upcastBootstrapTab() {
  return ( dispatcher ) => {
    dispatcher.on('element:li', (evt, data, conversionApi) => {
      const viewElement = data.viewItem;

      // When element was already consumed then skip it.
      if ( !conversionApi.consumable.test( viewElement, { name: true } ) ) {
        return;
      }

      // Consume only lis with a child with the the tab-link class. Otherwise, we return so
      // other converters can handle the element.
      if ( !viewElement.getChild(0) || typeof viewElement.getChild(0).hasClass !== 'function' || !viewElement.getChild(0).hasClass('tab-link') ) {
        return false;
      }

      let modelTab = conversionApi.writer.createElement(
        'bootstrapTab',
        {
          'target-id': viewElement.getChild(0).getAttribute('aria-controls'),
          'is-active': viewElement.hasClass('active'),
        }
      );

      if ( !conversionApi.safeInsert( modelTab, data.modelCursor ) ) {
        return;
      }

      conversionApi.consumable.consume( viewElement, { name: true } );

      // Convert the child link/text of the tab as well.
      conversionApi.convertItem(
        viewElement.getChild(0),
        conversionApi.writer.createPositionAt( modelTab, 'end' )
      );

      conversionApi.updateConversionResult( modelTab, data );
    });
  }
}

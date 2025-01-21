/**
 * @file
 * Provides JavaScript additions to ckeditor tabs bootstrap.
 *
 * This file provides bootstrap tabs in ckeditor.
 */

(function ($, Drupal) {

  "use strict";

  /**
   * Attach behaviors to tabs for ckeditor.
   */
  Drupal.behaviors.ckeditorTabs = {
    attach: function (context, settings) {
      if (typeof CKEDITOR === 'undefined') {
        var $viewTabs = $('.bootstrap-tabs', context);
        if ($viewTabs.length > 0) {
          tabsInit($viewTabs);
        }
        return;
      }
    }
  };

  function tabsInit(elements) {
    var $tabComponents = elements;

    if ($tabComponents.length > 0) {
      $tabComponents.each(function () {
        var $tabs = $(this).find('.nav-tabs');
        $tabs
          .off('click', 'li > a')
          .on('click', 'li > a', function (e) {
            e.preventDefault();

            var link = $(this);

            link
              .parent().addClass('active')
              .siblings().removeClass('active');

            link.parents('.bootstrap-tabs').find(link.attr('href')).addClass('active')
              .siblings().removeClass('active');
          })
      });
    }
  }

})(jQuery, Drupal);

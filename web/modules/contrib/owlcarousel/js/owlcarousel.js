/**
 * @file
 */

(function ($) {
  Drupal.behaviors.owl = {
    attach: function (context, settings) {
      $('.owl-slider-wrapper', context).each(function () {
        var $this = $(this);
        var $this_settings = $.parseJSON($this.attr('data-settings'));
		/**Add RTL TRUE to SETTINGS**START**/
		$this_settings.rtl = true;
		/**Add RTL TRUE to SETTINGS**END**/
        $this.owlCarousel($this_settings);
      });
    }
  };
})(jQuery);

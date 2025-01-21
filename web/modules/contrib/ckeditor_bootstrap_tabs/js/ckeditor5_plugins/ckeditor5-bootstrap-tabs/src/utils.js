import {ButtonView, createLabeledInputText, LabeledFieldView} from "ckeditor5/src/ui";

/**
 * @see https://stackoverflow.com/a/7627603
 */
export function makeSafeForCSS(name) {
  return name.replace(/[^a-z0-9]/g, function(s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
}

export function createInput(locale, label) {
  const labeledInput = new LabeledFieldView(locale, createLabeledInputText);
  labeledInput.label = label;

  return labeledInput;
}

export function createButton(label, icon, className) {
  const button = new ButtonView();
  button.set({
    label,
    icon,
    tooltip: true,
    class: className
  });

  return button;
}

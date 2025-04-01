export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    //set the loading text
    btn.textContent = loadingText;
  } else {
    //set the not loading text
    btn.textContent = defaultText;
  }
}

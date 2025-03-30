export function setButtonText(btn, isLoading, defaultText, loadingText) {
  if (isLoading) {
    //set the loading text
    btn.textContent = loadingText;
    console.log(`Setting text to ${loadingText}`);
  } else {
    //set the not loading text
    btn.textContent = defaultText;
  }
}

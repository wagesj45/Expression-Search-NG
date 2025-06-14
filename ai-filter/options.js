document.addEventListener('DOMContentLoaded', async () => {
  let {endpoint = 'http://127.0.0.1:5000/v1/classify', system = '[SYSTEM] You are the mail-classification engine.'} = await browser.storage.local.get(['endpoint','system']);
  document.getElementById('endpoint').value = endpoint;
  document.getElementById('system').value = system;
});

document.getElementById('save').addEventListener('click', async () => {
  await browser.storage.local.set({
    endpoint: document.getElementById('endpoint').value,
    system: document.getElementById('system').value
  });
});

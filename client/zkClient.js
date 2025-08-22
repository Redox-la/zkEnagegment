// zkClient.js
export async function sendActionToZkVerify(userActionData, apiKey) {
  try {
    const response = await fetch('https://api.zkverify.com/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(userActionData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending action to zkVerify:', error);
    return null;
  }
}

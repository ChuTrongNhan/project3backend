const { google } = require("googleapis");

function write(title, contentTable) {
  const { client_secret, client_id, redirect_uris } = {
    client_id:
      "397886605475-knks78lj09fn68ho17v9kru7km901652.apps.googleusercontent.com",
    project_id: "crawlerv1-1610460039310",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "Qn5kiJx6Z1_5ZHSOh_wGF2UC",
    redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
  };
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials({
    access_token:
      "ya29.a0AfH6SMAAsO8KhShiy_dYhP5ElqVvy-gEZTpJ_lBGbKL5BdiIDqx2DkhCkodV9vKAcV0xio80YI7cQbd9tvp3xT_GCoI2hSxXuYCTg14wYgWTOZ7SP2MqzaIm9pURgg-fykt9cfdEcp2qEy5dYS3OzmzjkHcHlb0Kf4YZABPcDXw",
    refresh_token:
      "1//0ekenipqxMURKCgYIARAAGA4SNwF-L9IrnDOyHjEITlFh8qSo1KJqUX8CygrwLRozambZyrssyaFdHpsKZZdKRACaxmUIhWk5wnc",
    scope: "https://www.googleapis.com/auth/spreadsheets",
    token_type: "Bearer",
    expiry_date: 1610474855001,
  });
  return writesheet(oAuth2Client, title, contentTable);
}

async function writesheet(auth, title, contentTable) {
  const sheets = google.sheets({ version: "v4", auth });
  const request = {
    resource: {
      properties: {
        title: title,
      },
    },
    fields: "spreadsheetId",
    auth,
  };
  try {
    const response = await sheets.spreadsheets.create(request);
    await sheets.spreadsheets.values.update({
      spreadsheetId: response.data.spreadsheetId,
      range: "A1",
      valueInputOption: "RAW",
      resource: { values: contentTable },
    });
    return response.data.spreadsheetId;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

module.exports.write = write;

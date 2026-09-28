function escapeHtml(
  value
) {
  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


export function printPaymentReceipt({
  patient,
  payment,
  salePrice,
  totalPaid,
  remaining,
}) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }


  const money =
    (value) =>
      new Intl.NumberFormat(
        "tr-TR",
        {
          style:
            "currency",

          currency:
            "TRY",

          maximumFractionDigits:
            0,
        }
      ).format(
        Number(
          value || 0
        )
      );


  const date =
    payment.payment_date
      ? new Intl.DateTimeFormat(
          "tr-TR",
          {
            day:
              "2-digit",

            month:
              "2-digit",

            year:
              "numeric",
          }
        ).format(
          new Date(
            `${payment.payment_date}T12:00:00`
          )
        )
      : "—";


  const receiptNumber =
    String(
      payment.id ||
        ""
    )
      .replace(
        /-/g,
        ""
      )
      .slice(
        0,
        10
      )
      .toUpperCase();


  const patientName =
    escapeHtml(
      patient.full_name ||
        "—"
    );


  const tcIdentity =
    escapeHtml(
      patient.tc_identity ||
        "—"
    );


  const phone =
    escapeHtml(
      patient.phone ||
        "—"
    );


  const paymentMethod =
    escapeHtml(
      payment.payment_method ||
        "—"
    );


  const note =
    escapeHtml(
      payment.note ||
        ""
    );


  const html = `
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<title>Tahsilat Makbuzu</title>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 35px;
    font-family: Arial, sans-serif;
    color: #182230;
    background: #ffffff;
  }

  .receipt {
    max-width: 760px;
    margin: 0 auto;
    border: 1px solid #d0d5dd;
    border-radius: 14px;
    padding: 30px;
  }

  .head {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    padding-bottom: 22px;
    border-bottom: 2px solid #00aaaa;
  }

  h1 {
    margin: 0;
    font-size: 25px;
  }

  .brand {
    color: #008b8b;
    font-size: 18px;
    font-weight: 700;
  }

  .muted {
    color: #667085;
  }

  .number {
    text-align: right;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 13px;
    margin: 25px 0;
  }

  .box {
    border: 1px solid #eaecf0;
    border-radius: 10px;
    padding: 14px;
  }

  .box span {
    display: block;
    color: #667085;
    font-size: 12px;
    margin-bottom: 6px;
  }

  .box strong {
    font-size: 15px;
  }

  .amount {
    margin: 25px 0;
    padding: 22px;
    border-radius: 12px;
    background: #ecfdfb;
  }

  .amount span {
    display: block;
    color: #067647;
    margin-bottom: 5px;
  }

  .amount strong {
    color: #05603a;
    font-size: 31px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    padding: 11px 0;
    border-bottom: 1px solid #eaecf0;
  }

  td:last-child {
    text-align: right;
    font-weight: bold;
  }

  .note {
    margin-top: 25px;
    padding: 14px;
    background: #f9fafb;
    border-radius: 10px;
    color: #475467;
  }

  footer {
    margin-top: 35px;
    padding-top: 18px;
    border-top: 1px solid #eaecf0;
    color: #667085;
    font-size: 12px;
    line-height: 1.7;
  }

  @media print {
    body {
      padding: 0;
    }

    .receipt {
      border: 0;
    }
  }
</style>
</head>

<body>

<div class="receipt">

  <div class="head">

    <div>

      <div class="brand">
        DuyAnt İşitme Cihazları
      </div>

      <h1>
        Tahsilat Makbuzu
      </h1>

    </div>


    <div class="number">

      <strong>
        #${escapeHtml(
          receiptNumber ||
            "DUYANT"
        )}
      </strong>

      <div class="muted">
        ${escapeHtml(
          date
        )}
      </div>

    </div>

  </div>


  <div class="grid">

    <div class="box">

      <span>
        Hasta
      </span>

      <strong>
        ${patientName}
      </strong>

    </div>


    <div class="box">

      <span>
        TC Kimlik No
      </span>

      <strong>
        ${tcIdentity}
      </strong>

    </div>


    <div class="box">

      <span>
        Telefon
      </span>

      <strong>
        ${phone}
      </strong>

    </div>


    <div class="box">

      <span>
        Ödeme Yöntemi
      </span>

      <strong>
        ${paymentMethod}
      </strong>

    </div>

  </div>


  <div class="amount">

    <span>
      Tahsil Edilen Tutar
    </span>

    <strong>
      ${escapeHtml(
        money(
          payment.amount
        )
      )}
    </strong>

  </div>


  <table>

    <tr>

      <td>
        Satış Bedeli
      </td>

      <td>
        ${escapeHtml(
          money(
            salePrice
          )
        )}
      </td>

    </tr>


    <tr>

      <td>
        Güncel Toplam Tahsilat
      </td>

      <td>
        ${escapeHtml(
          money(
            totalPaid
          )
        )}
      </td>

    </tr>


    <tr>

      <td>
        Güncel Kalan Borç
      </td>

      <td>
        ${escapeHtml(
          money(
            remaining
          )
        )}
      </td>

    </tr>

  </table>


  ${
    note
      ? `
        <div class="note">
          <strong>Not:</strong>
          ${note}
        </div>
      `
      : ""
  }


  <footer>
    DuyAnt İşitme Cihazları<br />
    Göçerler Mahallesi 5383 Sokak Terra Concept Sitesi
    A4 Blok 78 Bağımsız Bölüm No: 2U, Kepez / Antalya<br />
    Telefon: 0541 624 07 00
  </footer>

</div>

<script>
  window.onload = function () {
    window.print();
  };
</script>

</body>
</html>
`;


  const popup =
    window.open(
      "",
      "_blank",
      "width=900,height=800"
    );


  if (
    !popup
  ) {
    window.alert(
      "Makbuz penceresi açılamadı. Tarayıcı açılır pencere engelini kontrol edin."
    );

    return;
  }


  popup.document.open();

  popup.document.write(
    html
  );

  popup.document.close();
}

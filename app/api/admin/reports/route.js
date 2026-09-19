import {
  NextResponse,
} from "next/server";

import {
  isAdminAuthenticated,
} from "@/lib/admin-auth";

import {
  supabaseRest,
} from "@/lib/supabase-rest";


function unauthorized() {
  return NextResponse.json(
    {
      error:
        "Yetkisiz erişim.",
    },
    {
      status: 401,
    }
  );
}


function getTurkeyToday() {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        "Europe/Istanbul",

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",
    }
  ).format(
    new Date()
  );
}


function validMonth(
  value
) {
  return /^\d{4}-\d{2}$/.test(
    String(
      value || ""
    )
  );
}


function number(
  value
) {
  const result =
    Number(
      value || 0
    );


  return Number.isFinite(
    result
  )
    ? result
    : 0;
}


function paymentStatus(
  salePrice,
  totalPaid
) {
  if (
    salePrice > 0 &&
    totalPaid >=
      salePrice
  ) {
    return "Ödendi";
  }


  if (
    totalPaid > 0
  ) {
    return "Kısmi";
  }


  return "Bekliyor";
}


export async function GET(
  request
) {
  if (
    !(await isAdminAuthenticated())
  ) {
    return unauthorized();
  }


  try {
    const url =
      new URL(
        request.url
      );


    const today =
      getTurkeyToday();


    const requestedMonth =
      url.searchParams.get(
        "month"
      );


    const month =
      validMonth(
        requestedMonth
      )
        ? requestedMonth
        : today.slice(
            0,
            7
          );


    const [
      patients,
      payments,
      inventory,
      expenses,
    ] =
      await Promise.all([
        supabaseRest(
          "patients?select=id,full_name,tc_identity,phone,inventory_id,device_name,device_side,sale_quantity,sale_price,purchase_cost,purchase_date,report_status,institution_status,created_at&order=purchase_date.desc,created_at.desc&limit=5000"
        ),

        supabaseRest(
          "payments?select=id,patient_id,amount,payment_date,payment_method,note,created_at&order=payment_date.desc,created_at.desc&limit=10000"
        ),

        supabaseRest(
          "inventory?select=id,brand,product_name,category,stock_quantity,purchase_price&limit=5000"
        ),

        supabaseRest(
          "expenses?select=id,expense_date,category,amount,payment_method,description,created_at&order=expense_date.desc,created_at.desc&limit=10000"
        ),
      ]);


    const allPatients =
      patients || [];


    const allPayments =
      payments || [];


    const allInventory =
      inventory || [];


    const allExpenses =
      expenses || [];


    const inventoryMap =
      new Map(
        allInventory.map(
          (item) => [
            item.id,
            item,
          ]
        )
      );


    const paymentsByPatient =
      new Map();


    for (
      const payment
      of allPayments
    ) {
      const current =
        paymentsByPatient.get(
          payment.patient_id
        ) || 0;


      paymentsByPatient.set(
        payment.patient_id,
        current +
          number(
            payment.amount
          )
      );
    }


    const todayPatients =
      allPatients.filter(
        (patient) =>
          patient.purchase_date ===
          today
      );


    const monthPatients =
      allPatients.filter(
        (patient) =>
          String(
            patient.purchase_date ||
              ""
          ).startsWith(
            month
          )
      );


    const todayPayments =
      allPayments.filter(
        (payment) =>
          payment.payment_date ===
          today
      );


    const monthPayments =
      allPayments.filter(
        (payment) =>
          String(
            payment.payment_date ||
              ""
          ).startsWith(
            month
          )
      );


    const todayExpenses =
      allExpenses.filter(
        (expense) =>
          expense.expense_date ===
          today
      );


    const monthExpenses =
      allExpenses.filter(
        (expense) =>
          String(
            expense.expense_date ||
              ""
          ).startsWith(
            month
          )
      );


    const todaySalesRevenue =
      todayPatients.reduce(
        (sum, patient) =>
          sum +
          number(
            patient.sale_price
          ),
        0
      );


    const todayDeviceCount =
      todayPatients.reduce(
        (sum, patient) =>
          sum +
          number(
            patient.sale_quantity ||
              1
          ),
        0
      );


    const todayCollections =
      todayPayments.reduce(
        (sum, payment) =>
          sum +
          number(
            payment.amount
          ),
        0
      );


    const todayExpenseTotal =
      todayExpenses.reduce(
        (sum, expense) =>
          sum +
          number(
            expense.amount
          ),
        0
      );


    const monthRevenue =
      monthPatients.reduce(
        (sum, patient) =>
          sum +
          number(
            patient.sale_price
          ),
        0
      );


    const monthDeviceCount =
      monthPatients.reduce(
        (sum, patient) =>
          sum +
          number(
            patient.sale_quantity ||
              1
          ),
        0
      );


    const monthCollections =
      monthPayments.reduce(
        (sum, payment) =>
          sum +
          number(
            payment.amount
          ),
        0
      );


    const monthPurchaseCost =
      monthPatients.reduce(
        (sum, patient) =>
          sum +
          number(
            patient.purchase_cost
          ),
        0
      );


    const monthGrossProfit =
      monthRevenue -
      monthPurchaseCost;


    const monthExpenseTotal =
      monthExpenses.reduce(
        (sum, expense) =>
          sum +
          number(
            expense.amount
          ),
        0
      );


    const monthNetProfit =
      monthGrossProfit -
      monthExpenseTotal;


    let totalReceivable =
      0;


    for (
      const patient
      of allPatients
    ) {
      const salePrice =
        number(
          patient.sale_price
        );


      const totalPaid =
        paymentsByPatient.get(
          patient.id
        ) || 0;


      totalReceivable +=
        Math.max(
          salePrice -
            totalPaid,
          0
        );
    }


    const brandMap =
      new Map();


    for (
      const patient
      of monthPatients
    ) {
      const inventoryItem =
        inventoryMap.get(
          patient.inventory_id
        );


      const brand =
        inventoryItem?.brand ||
        "Diğer";


      const current =
        brandMap.get(
          brand
        ) || {
          brand,
          salesCount: 0,
          deviceCount: 0,
          revenue: 0,
          cost: 0,
          grossProfit: 0,
        };


      current.salesCount +=
        1;


      current.deviceCount +=
        number(
          patient.sale_quantity ||
            1
        );


      current.revenue +=
        number(
          patient.sale_price
        );


      current.cost +=
        number(
          patient.purchase_cost
        );


      current.grossProfit =
        current.revenue -
        current.cost;


      brandMap.set(
        brand,
        current
      );
    }


    const preferredBrands = [
      "Coselgi",
      "Unitron",
    ];


    const brands =
      preferredBrands.map(
        (brand) =>
          brandMap.get(
            brand
          ) || {
            brand,
            salesCount: 0,
            deviceCount: 0,
            revenue: 0,
            cost: 0,
            grossProfit: 0,
          }
      );


    for (
      const [
        brand,
        stats,
      ]
      of brandMap
    ) {
      if (
        !preferredBrands.includes(
          brand
        )
      ) {
        brands.push(
          stats
        );
      }
    }


    const methodMap =
      new Map();


    for (
      const payment
      of monthPayments
    ) {
      const method =
        payment.payment_method ||
        "Diğer";


      methodMap.set(
        method,
        (
          methodMap.get(
            method
          ) || 0
        ) +
          number(
            payment.amount
          )
      );
    }


    const paymentMethods =
      [
        "Nakit",
        "Kart",
        "Havale/EFT",
        "Diğer",
      ].map(
        (method) => ({
          method,

          amount:
            methodMap.get(
              method
            ) || 0,
        })
      );


    const expenseCategoryMap =
      new Map();


    for (
      const expense
      of monthExpenses
    ) {
      const category =
        expense.category ||
        "Diğer";


      expenseCategoryMap.set(
        category,
        (
          expenseCategoryMap.get(
            category
          ) || 0
        ) +
          number(
            expense.amount
          )
      );
    }


    const expenseCategories =
      Array.from(
        expenseCategoryMap.entries()
      )
        .map(
          ([
            category,
            amount,
          ]) => ({
            category,
            amount,
          })
        )
        .sort(
          (a, b) =>
            b.amount -
            a.amount
        );


    const sales =
      monthPatients.map(
        (patient) => {
          const salePrice =
            number(
              patient.sale_price
            );


          const cost =
            number(
              patient.purchase_cost
            );


          const totalPaid =
            paymentsByPatient.get(
              patient.id
            ) || 0;


          const remaining =
            Math.max(
              salePrice -
                totalPaid,
              0
            );


          const inventoryItem =
            inventoryMap.get(
              patient.inventory_id
            );


          return {
            id:
              patient.id,

            full_name:
              patient.full_name,

            tc_identity:
              patient.tc_identity,

            phone:
              patient.phone,

            brand:
              inventoryItem?.brand ||
              "—",

            device_name:
              patient.device_name,

            device_side:
              patient.device_side,

            sale_quantity:
              number(
                patient.sale_quantity ||
                  1
              ),

            sale_price:
              salePrice,

            purchase_cost:
              cost,

            gross_profit:
              salePrice -
              cost,

            total_paid:
              totalPaid,

            remaining,

            payment_status:
              paymentStatus(
                salePrice,
                totalPaid
              ),

            report_status:
              patient.report_status,

            institution_status:
              patient.institution_status,

            purchase_date:
              patient.purchase_date,
          };
        }
      );


    sales.sort(
      (a, b) =>
        String(
          b.purchase_date ||
            ""
        ).localeCompare(
          String(
            a.purchase_date ||
              ""
          )
        )
    );


    return NextResponse.json({
      period: {
        today,
        month,
      },

      metrics: {
        todaySalesRevenue,
        todayDeviceCount,
        todayCollections,
        todayExpenseTotal,

        monthRevenue,
        monthDeviceCount,
        monthCollections,

        monthPurchaseCost,
        monthGrossProfit,

        monthExpenseTotal,
        monthNetProfit,

        totalReceivable,
      },

      brands,

      paymentMethods,

      expenseCategories,

      expenses:
        monthExpenses,

      sales,
    });

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Rapor verileri alınamadı.",
      },
      {
        status: 500,
      }
    );
  }
}
// Client ID and API key from the Developer Console
const SPREED_SHEET_ID = "1bNrzEqyqLheORoor8DdN0v6p_cuK14Kd4kGEVJM33ko";

const BASE_URI = `https://spreadsheets.google.com/feeds/list/${SPREED_SHEET_ID}/${1}/public/full?alt=json`;

$(document).ready(async () => {
  $.ajax({
    type: "GET",
    url: BASE_URI,
    cache: true,
    dataType: "json",
    success: function ({ feed }) {
      const tailors = feed.entry;
      const data = tailors.map(({ content }) => {
        const payload = [];
        const fields = content.$t;
        const fieldData = fields.split(",");

        for (const option of fieldData) {
          const [nill, userData] = option.split(":");
          payload.push(userData ? userData.trim() : nill);
        }
        return payload;
      });

      // $("#example").DataTable({ data });
    },
  });

  /*Dropdown Menu*/
  $(".dropdown").click(function () {
    $(this).attr("tabindex", 1).focus();
    $(this).toggleClass("active");
    $(this).find(".dropdown-menu").slideToggle(300);
  });

  $(".dropdown").focusout(function () {
    $(this).removeClass("active");
    $(this).find(".dropdown-menu").slideUp(300);
  });

  $(".dropdown .dropdown-menu li").click(function () {
    $(this).parents(".dropdown").find("span").text($(this).text());
    $(this)
      .parents(".dropdown")
      .find("input")
      .attr("value", $(this).attr("id"));
  });

  /*End Dropdown Menu*/

  $(".dropdown-submit").click(function () {
    const stateValue = $("#selected-state").val();
    const lgaValue = $("#selected-lga").val();
  });
});

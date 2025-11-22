/*
JS for Reserve Tee Time Framework (Frontend)
*/
jQuery(document).ready(function () {
  /* Filtering cities by country in homepage search */
  jQuery(".rttsearchcoursesform select[name=rttsearchcountry]").change(
    function () {
      var country_id = jQuery("option:selected", this).attr("data-countryid");
      jQuery(".rttsearchcoursesform select[name=rttsearchcity]").val("");
      jQuery(
        ".rttsearchcoursesform select[name=rttsearchcity] option:not(:first)"
      ).hide();
      jQuery(
        ".rttsearchcoursesform select[name=rttsearchcity] option[data-country=" +
          country_id +
          "]"
      ).show();
    }
  );
  /* Initiating date fields */
  jQuery(".rttsearch-datefield").datepicker({
    dateFormat: "dd-mm-yy",
    changeMonth: true,
    changeYear: true,
    yearRange: "+00:+01",
    minDate: 0,
    firstDay: 1,
  });
  /* Initiating golf course search field */
  jQuery("#rttsearch-coursefield").selectize({
    placeholder: "Search for country, course, region...",
    openOnFocus: false,
    render: {
      option: function (data) {
        return (
          "<div class='option' data-url='" +
          data.url +
          "'>" +
          data.text +
          "</div>"
        );
      },
    },
  });
  /* Golf course search in homepage */
  jQuery("#rttsearch-coursefield").change(function () {
    var course_id = Number(jQuery(this).val());
    if (course_id > 0) {
      var course_url = jQuery(
        ".rttsearchcoursesform .selectize-dropdown .option.selected"
      ).attr("data-url");
      if (course_url && course_url != "") {
        jQuery(".rttsearchcoursesform").attr("action", course_url);
        jQuery(".rttsearchcoursesform").attr("disabled", false);
        jQuery(".rttsearchcoursesform-button").attr("disabled", false);
      } else {
        jQuery(".rttsearchcoursesform").attr("disabled", true);
        jQuery(".rttsearchcoursesform-button").attr("disabled", true);
      }
    } else {
      jQuery(".rttsearchcoursesform").attr("disabled", true);
      jQuery(".rttsearchcoursesform-button").attr("disabled", true);
    }
  });
  /* Tee times search in course page */
  jQuery("#rttsearch-searchbutton").click(function () {
    var rttidfacility = jQuery(
      "#rttsearch-filters input[name='id_facility']"
    ).val();
    var rttdate = jQuery("#rttsearch-filters input[name='date']").val();
    var rttplayers = jQuery("#rttsearch-filters select[name='players']").val();
    var rttholes = jQuery("#rttsearch-filters select[name='holes']").val();

    // ! TODO: Search Results
    //jQuery('html,body').animate({scrollTop:jQuery("#rttsearch-results").offset().top},1000);
    jQuery("html,body").animate({ scrollTop: 0 }, 1000);
    if (
      Number(rttidfacility) > 0 &&
      rttdate != "" &&
      Number(rttplayers) > 0 &&
      Number(rttplayers) < 5 &&
      (Number(rttholes) == 9 || Number(rttholes) == 18)
    ) {
      jQuery("#rttsearch-results").html(
        "<div class='e-con-inner'><p class='rttsearch-loading'><img src='" +
          reserveteetimefw_ajax.loadingurl +
          "' /> We are searching your tee time...</p></div>"
      );
      jQuery.ajax({
        url: reserveteetimefw_ajax.ajaxurl,
        type: "POST",
        data: {
          action: "teetimesearch",
          id_facility: rttidfacility,
          date: rttdate,
          players: rttplayers,
          holes: rttholes,
        },
        success: function (data) {
          result = jQuery.parseJSON(data);
          jQuery("#rttsearch-results").html(
            "<div class='e-con-inner'>" + result.results + "</div>"
          );
        },
        error: function (errorThrown) {
          alert("There was a problem, please contact the administrator.");
          console.log(errorThrown);
        },
      });
    } else {
      jQuery("#rttsearch-results").html(
        "<div class='e-con-inner'><div class='rttsearch-errorbox'>You must fill all fields.</div></div>"
      );
    }
  });
  /* Automatic tee time search if fields were filled */
  if (jQuery("body").hasClass("single-courses")) {
    var params = new window.URLSearchParams(window.location.search);
    var date = params.get("date");
    var players = Number(params.get("players"));
    var holes = Number(params.get("holes"));
    if (date != "" && players > 0 && holes > 0)
      jQuery("#rttsearch-searchbutton").trigger("click");
  }

  // ! TODO:

  /* Checks if reservation has extra products to display the popup or proceed */
  jQuery("#rttsearch-results").on(
    "submit",
    ".rtt-teetimesform",
    function (event) {
      var has_extraproducts = Number(
        jQuery("input[name='has_extraproducts']", this).val()
      );
      if (has_extraproducts == 1) {
        var submit_button = jQuery("input[type='submit']", this);
        submit_button.attr("value", "Please wait...");

        var teetime_id = jQuery("input[name='teetime_id']", this).val();
        var id_facility = jQuery("input[name='id_facility']", this).val();
        var date = jQuery("input[name='date']", this).val();
        var time = jQuery("input[name='time']", this).val();
        var cancelperiod = jQuery("input[name='cancelperiod']", this).val();
        var players = jQuery("input[name='players']", this).val();
        var productId = jQuery("input[name='productId']", this).val();
        var course = jQuery("input[name='course']", this).val();
        var holes = jQuery("input[name='holes']", this).val();
        var price = jQuery("input[name='price']", this).val();
        var currency = jQuery("input[name='currency']", this).val();
        var extraproducts = jQuery("input[name='extraproducts']", this).val();

        var gm_slots = jQuery("input[name='gm_slots']", this).val();
        var gm_idResource = jQuery("input[name='gm_idResource']", this).val();
        var gm_idType = jQuery("input[name='gm_idType']", this).val();

        jQuery.ajax({
          url: reserveteetimefw_ajax.ajaxurl,
          type: "POST",
          data: {
            action: "teetimesearchfillpopup",
            teetime_id: teetime_id,
            id_facility: id_facility,
            date: date,
            time: time,
            cancelperiod: cancelperiod,
            players: players,
            productId: productId,
            course: course,
            holes: holes,
            price: price,
            currency: currency,
            extraproducts: extraproducts,

            gm_slots: gm_slots,
            gm_idResource: gm_idResource,
            gm_idType: gm_idType,
          },
          success: function (data) {
            result = jQuery.parseJSON(data);
            jQuery("#rttsearch-popup-form").html(result.results);
            jQuery(".rttsearch-overlay").fadeIn();
            submit_button.attr("value", "Reserve");
          },
          error: function (errorThrown) {
            alert("There was a problem, please contact the administrator.");
            console.log(errorThrown);
            submit_button.attr("value", "Reserve");
          },
        });

        return false;
      } else return true;
    }
  );
  /* Increase/decrease products in popup */
  jQuery("#rttsearch-popup-form").on(
    "click",
    ".rttsearch-popupminus",
    function (event) {
      event.preventDefault();
      this.parentNode.querySelector("input[type=number]").stepDown();
      rttpopup_recalculate();
    }
  );
  jQuery("#rttsearch-popup-form").on(
    "click",
    ".rttsearch-popupplus",
    function (event) {
      event.preventDefault();
      this.parentNode.querySelector("input[type=number]").stepUp();
      rttpopup_recalculate();
    }
  );
  /* Updating extra products popup total */
  jQuery("#rttsearch-popup-form").on(
    "change keyup",
    "input[type=number]",
    function (event) {
      rttpopup_recalculate();
    }
  );
  function rttpopup_recalculate() {
    var priceextra = 0;
    var pricetotal = Number(
      jQuery("#rttsearch-popup-form input[name=baseprice]").val()
    );
    jQuery("#rttsearch-popup-form .rttsearch-popupextraproduct").each(function (
      index
    ) {
      var productprice = Number(
        jQuery("input[name='extraproductprice[]']", this).val()
      );
      var productqty = Number(
        jQuery("input[name='extraproductqty[]']", this).val()
      );
      if (productqty < 0) productqty = 0;
      var producttotal = productprice * productqty;
      priceextra += producttotal;
      pricetotal += producttotal;
    });
    jQuery("#rttsearch-popuptotalextraproducts").html(priceextra);
    jQuery("#rttsearch-popuptotal").html(pricetotal);
  }
  /* Closing extra products popup */
  jQuery(".rttsearch-popupclose").click(function () {
    jQuery(".rttsearch-overlay").fadeOut();
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   // You can add a button and attach this logic to a click event
//   // For a simple test, we will just fire it immediately.

//   console.log("Testing API...");

//   // The data you want to send
//   const testPayload = {
//     tenant: "demo",
//     reservations: [
//       {
//         idResource: 10,
//         start: "2025-08-21T11:30:00+02:00",
//         name: "Hamza Waqar",
//         email: "dayesop201@euleina.com",
//         idType: 10,
//         timeout: "2025-08-21T09:40:41+00:00",
//       },
//     ],
//   };

//   fetch(myApi.apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-WP-Nonce": myApi.nonce, // Send the nonce for authentication
//     },
//     body: JSON.stringify(testPayload),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         console.error("API Test Failed! Status: " + response.status);
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log("API Test Succeeded! Response:", data);
//     })
//     .catch((error) => {
//       console.error("There was a problem with the fetch operation:", error);
//     });
// });

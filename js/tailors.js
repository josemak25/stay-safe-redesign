// Client ID and API key from the Developer Console
const SPREED_SHEET_ID = '1bNrzEqyqLheORoor8DdN0v6p_cuK14Kd4kGEVJM33ko';

const BASE_URI = `https://spreadsheets.google.com/feeds/list/${SPREED_SHEET_ID}/${1}/public/full?alt=json`;

$(document).ready(async () => {
  $.ajax({
    type: 'GET',
    url: BASE_URI,
    cache: true,
    dataType: 'json',
    success: function({ feed }) {
      const tailors = feed.entry;
      let data = tailors.map(({ content }) => {
        const payload = [];
        const { $t } = content;
        const singleData = $t.split(',');

        let objOutput = {};
        for (let i = 0, length = singleData.length; i < length; i++) {
          let keyValue = singleData[i].split(':');
          objOutput[keyValue[0].trim().replace(/-/g, '')] = keyValue[1]
            ? keyValue[1].trim()
            : null;
        }
        payload.push(objOutput);

        return payload[0];
      });
      data = data.filter(item => item.lga && item.state);
      localStorage.setItem('tn', JSON.stringify(data));

      const stateDropDown = document.querySelector('.state-dropdown');

      let states = [];
      let lgas = [];
      for (let i in data) {
        states.push(data[i].state);
      }

      states = [...new Set(states)].sort();
      lgas = [...new Set(lgas)].sort();

      for (let k of states) {
        stateDropDown.innerHTML += `<li class="dropdown-item" id="${k}">${k}</li>`;
      }
    },
  });

  /*Dropdown Menu*/
  $('.dropdown').click(function() {
    $(this)
      .attr('tabindex', 1)
      .focus();
    $(this).toggleClass('active');
    $(this)
      .find('.dropdown-menu')
      .slideToggle(300);
  });

  $('.dropdown').focusout(function() {
    $(this).removeClass('active');
    $(this)
      .find('.dropdown-menu')
      .slideUp(300);
  });

  $(document).on('click', 'li.dropdown-item', function() {
    $(this)
      .parents('.dropdown')
      .find('span')
      .text($(this).text());
    $(this)
      .parents('.dropdown')
      .find('input')
      .attr('value', $(this).attr('id'));

    let selectedValue = $(this).text();
    const data = JSON.parse(localStorage.getItem('tn'));

    let lgaRet = data.filter(item => item.state == selectedValue);
    let lgas = [];
    if (lgaRet.length) {
      for (let i in lgaRet) {
        lgas.push(lgaRet[i].lga);
      }
    } else {
      try {
        lgaDropDown.innerHTML += `<li class="dropdown-item" id="lga">No LGAs available</li>`;
      } catch (error) {}
    }
    const lgaDropDown = document.querySelector('.lga-dropdown');

    lgas = [...new Set(lgas)].sort();
    lgaDropDown.innerHTML = '';
    for (let l of lgas) {
      lgaDropDown.innerHTML += `<li class="dropdown-item" id="${l}">${l}</li>`;
    }
  });

  /*End Dropdown Menu*/

  $('.dropdown-submit').click(function() {
    const stateValue = $('#selected-state').val();
    const lgaValue = $('#selected-lga').val();

    let stateReg = new RegExp(stateValue, 'i');
    let lgaReg = new RegExp(lgaValue, 'i');

    const data = JSON.parse(localStorage.getItem('tn'));
    const result = data.filter(item => {
      return item.state.match(stateReg) && item.lga.match(lgaReg);
    });
    const resultTable = document.querySelector('#result-table tbody');

    if (!result.length) {
      $('.filter-result-section').css('display', 'block');
      $('.table-section').css('display', 'none');
    } else {
      $('.filter-result-section').css('display', 'none');
      $('.table-section').css('display', 'block');

      resultTable.classList.add('show-table');
      resultTable.innerHTML = ``;
      result.forEach(item => {
        resultTable.innerHTML += `<tr>
        <td>${item.firstname}</td>
        <td>${item.lastname}</td>
        <td>${item.phonenumber}</td>
        <td>${item.emailaddress}</td>
        <td>${item.companyname}</td>
        <td>${item.lga}</td>
        <td>${item.state}</td>
        <td>${item.capacity}</td>
        </tr>`;
      });
    }
  });
});

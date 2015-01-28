/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

$(function () {
  var $units = $('#units');
  var offset = 0;
  var limit = 100;
  var $loading = $('#loading');
  var scroll_timer = null;
  var $search = $('#search');
  var masonry = new Masonry ($units.selector, {
                  itemSelector: '.unit',
                  columnWidth: 1,
                  transitionDuration: '0.3s',
                  visibleStyle: {
                    opacity: 1,
                    transform: 'none'
                  }});

  var setPictureFeature = function ($obj, isAppended) {
    $obj.imagesLoaded (function () {
      $obj.find ('.img').css ({'height': $obj.removeClass ('hide').find ('.img img').css ('height')});
      $obj.find ('.cover').fancybox ({
          beforeLoad: function() {
            this.title = '<a href="' + $(this.element).data ('href') + '" target="_blank">' + $(this.element).attr ('title') + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path d="M4 1h7q0.414 0 0.707 0.293t0.293 0.707-0.293 0.707-0.707 0.293h-7q-0.414 0-0.707 0.293t-0.293 0.707v16q0 0.414 0.293 0.707t0.707 0.293h16q0.414 0 0.707-0.293t0.293-0.707v-7q0-0.414 0.293-0.707t0.707-0.293 0.707 0.293 0.293 0.707v7q0 1.242-0.879 2.121t-2.121 0.879h-16q-1.242 0-2.121-0.879t-0.879-2.121v-16q0-1.242 0.879-2.121t2.121-0.879zM16 1h6q0.414 0 0.707 0.293t0.293 0.707v6q0 0.414-0.293 0.707t-0.707 0.293-0.707-0.293-0.293-0.707v-3.586l-8.297 8.297q-0.289 0.289-0.703 0.289-0.43 0-0.715-0.285t-0.285-0.715q0-0.414 0.289-0.703l8.297-8.297h-3.586q-0.414 0-0.707-0.293t-0.293-0.707 0.293-0.707 0.707-0.293z" fill="#000000"></path></svg></a>';
          },
          padding : 0,
          helpers : { overlay: { locked: false }, title : { type : 'over' } }
        });
      if (isAppended) masonry.appended ($obj.get (0));
      else masonry.prepended ($obj.get (0));
      return $obj;
    });
  };

  var loadData = function (isReload) {
    var tags = $search.val ().trim ().split (/[\s,]+/);
    if (!tags.length) return;
    if (isReload) offset = 0;

    var url = [
            'https://api.flickr.com/services/rest/?',
            'jsoncallback=?',
            'method=flickr.photos.search',
            'api_key=09dc017022847889346d048182b9515f',
            'tags=' + tags.join (","),
            'per_page=' + limit,
            'page=' + offset,
            'extras=url_m,owner_name,url_l',
            'sort=interestingness-desc',
            'format=json'
          ].join ('&');
    offset += limit;

    $.ajax ({
      url: url,
      data: { },
      async: true, cache: false, dataType: 'json', type: 'GET',
      beforeSend: function () {
        if (isReload) {
          $loading.show ();

          $units.find ('.unit').map (function () {
            masonry.remove ($(this).get(0));
          });
          masonry.layout ();

          $loading.fadeOut (function () {
            $(this).hide ();
          });
        }
      }
    })
    .done (function (result) {
      if (result.stat == 'ok') {
        result.photos.photo.map (function (t, i) {
          var s = {
            id: t.id,
            src: t.url_m,
            src2: t.url_l,
            title: t.title,
            ownername: t.ownername,
            href: 'https://www.flickr.com/photos/' + t.owner + '/' + t.id
          };
          var $obj = $($(_.template ($('#_unit').html (), s) (s)));
          $obj.appendTo ($units).addClass ('hide');
          setPictureFeature ($obj, true);
        });
      }

    })
    .fail (function (result) { ajaxError (result); })
    .complete (function (result) { });
  };

  $search.keypress (function (e) {
    if ((e.keyCode ? e.keyCode : e.which) == 13)
      loadData (true);
  });
  $("#search_button").click (function () {
      loadData (true);
  });

  $loading.fadeOut (function () {
    $(this).hide ();
  });

  $(window).scroll (function () {
    clearTimeout (scroll_timer);
    if ($(window).height () + $(window).scrollTop () > $units.height () + $units.offset ().top - 50) {
      scroll_timer = setTimeout (loadData, 500);
    }
  }.bind (this)).scroll ();




});
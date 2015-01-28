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
      $obj.OAimgLiquid ();
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
            'extras=url_m,owner_name',
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
            title: t.title,
            ownername: t.ownername,
            href: 'https://www.flickr.com/photos/' + t.owner + '/' + t.id
          };
          var $obj = $($(_.template ($('#_unit').html (), s) (s)));
          $obj.prependTo ($units).addClass ('hide');
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
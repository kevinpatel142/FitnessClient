$(".sidebar-dropdown > a").click(function () {
    $(".sidebar-submenu").slideUp(200);
    if ($(this).parent().hasClass("active")) {
        $(".sidebar-dropdown").removeClass("active");
        $(this).parent().removeClass("active");
    } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this).next(".sidebar-submenu").slideDown(200);
        $(this).parent().addClass("active");
    }
});


// -------------------------------------------------------------
//   Smart Navigation
// -------------------------------------------------------------

// $(document).ready(function () {
//     $(".smart").each(function () {
//         var $frame = $(this);
//         var $slidee = $frame.children("ul").eq(0);
//         var $wrap = $frame.parent();

//         // Call Sly on frame
//         $frame.sly({
//             itemNav: "basic",
//             smart: 1,
//             activateOn: "click",
//             mouseDragging: 1,
//             touchDragging: 1,
//             releaseSwing: 1,
//             startAt: 0,
//             scrollBar: $wrap.find(".scrollbar"),
//             pagesBar: $wrap.find(".pages"),
//             activatePageOn: "click",
//             speed: 300,
//             elasticBounds: 1,
//             easing: "easeOutExpo",
//             dragHandle: 1,
//             dynamicHandle: 1,
//             clickBar: 1,

//             // Scrolling
//             scrollSource: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
//             scrollBy: 1, // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
//             scrollHijack: 100, // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
//             scrollTrap: 1, // Don't bubble scrolling when hitting scrolling limits.

//             // Buttons
//             forward: $wrap.find(".forward"),
//             backward: $wrap.find(".backward"),
//             prev: $wrap.find(".prev"),
//             next: $wrap.find(".next"),
//             prevPage: $wrap.find(".prevPage"),
//             nextPage: $wrap.find(".nextPage")
//         });

//         // To Start button
//         $wrap.find(".toStart").on("click", function () {
//             var item = $(this).data("item");
//             // Animate a particular item to the start of the frame.
//             // If no item is provided, the whole content will be animated.
//             $frame.sly("toStart", item);
//         });

//         // To Center button
//         $wrap.find(".toCenter").on("click", function () {
//             var item = $(this).data("item");
//             // Animate a particular item to the center of the frame.
//             // If no item is provided, the whole content will be animated.
//             $frame.sly("toCenter", item);
//         });

//         // To End button
//         $wrap.find(".toEnd").on("click", function () {
//             var item = $(this).data("item");
//             // Animate a particular item to the end of the frame.
//             // If no item is provided, the whole content will be animated.
//             $frame.sly("toEnd", item);
//         });

//         // Add item
//         $wrap.find(".add").on("click", function () {
//             $frame.sly("add", "<li>" + $slidee.children().length + "</li>");
//         });

//         // Remove item
//         $wrap.find(".remove").on("click", function () {
//             $frame.sly("remove", -1);
//         });
//     });
// });

// slider
// Avoid `console` errors in browsers that lack a console.
(function () {
    for (
        var a,
        e = function () { },
        b = "assert clear count debug dir dirxml error exception group groupCollapsed groupEnd info log markTimeline profile profileEnd table time timeEnd timeStamp trace warn".split(
            " "
        ),
        c = b.length,
        d = (window.console = window.console || {});
        c--;

    )
        (a = b[c]), d[a] || (d[a] = e);
})();

// LoremImages
(function (b) {
    b.fn.loremImages = function (e, d, j) {
        var a = b.extend({}, b.fn.loremImages.defaults, j);
        return this.each(function (c, k) {
            var f = b(k),
                g = "";
            for (c = 0; c < a.count; c++) {
                var h = e + Math.round(Math.random() * a.randomWidth),
                    i = d + Math.round(Math.random() * a.randomHeight);
                g += a.itemBuilder.call(
                    f,
                    c,
                    "//lorempixel.com/" +
                    (a.grey ? "g/" : "") +
                    h +
                    "/" +
                    i +
                    "/" +
                    (a.category ? a.category + "/" : "") +
                    "?" +
                    Math.round(Math.random() * 1e3),
                    h,
                    i
                );
            }
            f.append(g);
        });
    };
    b.fn.loremImages.defaults = {
        count: 10,
        grey: 0,
        randomWidth: 0,
        randomHeight: 0,
        category: 0,
        itemBuilder: function (e, d) {
            return '<img src="' + d + '" alt="Lorempixel">';
        }
    };
})(jQuery);

// jQuery easing 1.3
jQuery.easing.jswing = jQuery.easing.swing;
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function (e, a, c, b, d) {
        return jQuery.easing[jQuery.easing.def](e, a, c, b, d);
    },
    easeInQuad: function (e, a, c, b, d) {
        return b * (a /= d) * a + c;
    },
    easeOutQuad: function (e, a, c, b, d) {
        return -b * (a /= d) * (a - 2) + c;
    },
    easeInOutQuad: function (e, a, c, b, d) {
        return 1 > (a /= d / 2)
            ? (b / 2) * a * a + c
            : (-b / 2) * (--a * (a - 2) - 1) + c;
    },
    easeInCubic: function (e, a, c, b, d) {
        return b * (a /= d) * a * a + c;
    },
    easeOutCubic: function (e, a, c, b, d) {
        return b * ((a = a / d - 1) * a * a + 1) + c;
    },
    easeInOutCubic: function (e, a, c, b, d) {
        return 1 > (a /= d / 2)
            ? (b / 2) * a * a * a + c
            : (b / 2) * ((a -= 2) * a * a + 2) + c;
    },
    easeInQuart: function (e, a, c, b, d) {
        return b * (a /= d) * a * a * a + c;
    },
    easeOutQuart: function (e, a, c, b, d) {
        return -b * ((a = a / d - 1) * a * a * a - 1) + c;
    },
    easeInOutQuart: function (e, a, c, b, d) {
        return 1 > (a /= d / 2)
            ? (b / 2) * a * a * a * a + c
            : (-b / 2) * ((a -= 2) * a * a * a - 2) + c;
    },
    easeInQuint: function (e, a, c, b, d) {
        return b * (a /= d) * a * a * a * a + c;
    },
    easeOutQuint: function (e, a, c, b, d) {
        return b * ((a = a / d - 1) * a * a * a * a + 1) + c;
    },
    easeInOutQuint: function (e, a, c, b, d) {
        return 1 > (a /= d / 2)
            ? (b / 2) * a * a * a * a * a + c
            : (b / 2) * ((a -= 2) * a * a * a * a + 2) + c;
    },
    easeInSine: function (e, a, c, b, d) {
        return -b * Math.cos((a / d) * (Math.PI / 2)) + b + c;
    },
    easeOutSine: function (e, a, c, b, d) {
        return b * Math.sin((a / d) * (Math.PI / 2)) + c;
    },
    easeInOutSine: function (e, a, c, b, d) {
        return (-b / 2) * (Math.cos((Math.PI * a) / d) - 1) + c;
    },
    easeInExpo: function (e, a, c, b, d) {
        return 0 == a ? c : b * Math.pow(2, 10 * (a / d - 1)) + c;
    },
    easeOutExpo: function (e, a, c, b, d) {
        return a == d ? c + b : b * (-Math.pow(2, (-10 * a) / d) + 1) + c;
    },
    easeInOutExpo: function (e, a, c, b, d) {
        return 0 == a
            ? c
            : a == d
                ? c + b
                : 1 > (a /= d / 2)
                    ? (b / 2) * Math.pow(2, 10 * (a - 1)) + c
                    : (b / 2) * (-Math.pow(2, -10 * --a) + 2) + c;
    },
    easeInCirc: function (e, a, c, b, d) {
        return -b * (Math.sqrt(1 - (a /= d) * a) - 1) + c;
    },
    easeOutCirc: function (e, a, c, b, d) {
        return b * Math.sqrt(1 - (a = a / d - 1) * a) + c;
    },
    easeInOutCirc: function (e, a, c, b, d) {
        return 1 > (a /= d / 2)
            ? (-b / 2) * (Math.sqrt(1 - a * a) - 1) + c
            : (b / 2) * (Math.sqrt(1 - (a -= 2) * a) + 1) + c;
    },
    easeInElastic: function (e, a, c, b, d) {
        var e = 1.70158,
            f = 0,
            g = b;
        if (0 == a) return c;
        if (1 == (a /= d)) return c + b;
        f || (f = 0.3 * d);
        g < Math.abs(b)
            ? ((g = b), (e = f / 4))
            : (e = (f / (2 * Math.PI)) * Math.asin(b / g));
        return (
            -(
                g *
                Math.pow(2, 10 * (a -= 1)) *
                Math.sin(((a * d - e) * 2 * Math.PI) / f)
            ) + c
        );
    },
    easeOutElastic: function (e, a, c, b, d) {
        var e = 1.70158,
            f = 0,
            g = b;
        if (0 == a) return c;
        if (1 == (a /= d)) return c + b;
        f || (f = 0.3 * d);
        g < Math.abs(b)
            ? ((g = b), (e = f / 4))
            : (e = (f / (2 * Math.PI)) * Math.asin(b / g));
        return (
            g * Math.pow(2, -10 * a) * Math.sin(((a * d - e) * 2 * Math.PI) / f) + b + c
        );
    },
    easeInOutElastic: function (e, a, c, b, d) {
        var e = 1.70158,
            f = 0,
            g = b;
        if (0 == a) return c;
        if (2 == (a /= d / 2)) return c + b;
        f || (f = d * 0.3 * 1.5);
        g < Math.abs(b)
            ? ((g = b), (e = f / 4))
            : (e = (f / (2 * Math.PI)) * Math.asin(b / g));
        return 1 > a
            ? -0.5 *
            g *
            Math.pow(2, 10 * (a -= 1)) *
            Math.sin(((a * d - e) * 2 * Math.PI) / f) +
            c
            : 0.5 *
            g *
            Math.pow(2, -10 * (a -= 1)) *
            Math.sin(((a * d - e) * 2 * Math.PI) / f) +
            b +
            c;
    },
    easeInBack: function (e, a, c, b, d, f) {
        void 0 == f && (f = 1.70158);
        return b * (a /= d) * a * ((f + 1) * a - f) + c;
    },
    easeOutBack: function (e, a, c, b, d, f) {
        void 0 == f && (f = 1.70158);
        return b * ((a = a / d - 1) * a * ((f + 1) * a + f) + 1) + c;
    },
    easeInOutBack: function (e, a, c, b, d, f) {
        void 0 == f && (f = 1.70158);
        return 1 > (a /= d / 2)
            ? (b / 2) * a * a * (((f *= 1.525) + 1) * a - f) + c
            : (b / 2) * ((a -= 2) * a * (((f *= 1.525) + 1) * a + f) + 2) + c;
    },
    easeInBounce: function (e, a, c, b, d) {
        return b - jQuery.easing.easeOutBounce(e, d - a, 0, b, d) + c;
    },
    easeOutBounce: function (e, a, c, b, d) {
        return (a /= d) < 1 / 2.75
            ? b * 7.5625 * a * a + c
            : a < 2 / 2.75
                ? b * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c
                : a < 2.5 / 2.75
                    ? b * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + c
                    : b * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c;
    },
    easeInOutBounce: function (e, a, c, b, d) {
        return a < d / 2
            ? 0.5 * jQuery.easing.easeInBounce(e, 2 * a, 0, b, d) + c
            : 0.5 * jQuery.easing.easeOutBounce(e, 2 * a - d, 0, b, d) + 0.5 * b + c;
    }
});

// jQuery throttle / debounce - v1.1 - 3/7/2010
(function (b, c) {
    var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}),
        a;
    $.throttle = a = function (e, f, j, i) {
        var h,
            d = 0;
        if (typeof f !== "boolean") {
            i = j;
            j = f;
            f = c;
        }
        function g() {
            var o = this,
                m = +new Date() - d,
                n = arguments;
            function l() {
                d = +new Date();
                j.apply(o, n);
            }
            function k() {
                h = c;
            }
            if (i && !h) {
                l();
            }
            h && clearTimeout(h);
            if (i === c && m > e) {
                l();
            } else {
                if (f !== true) {
                    h = setTimeout(i ? k : l, i === c ? e - m : e);
                }
            }
        }
        if ($.guid) {
            g.guid = j.guid = j.guid || $.guid++;
        }
        return g;
    };
    $.debounce = function (d, e, f) {
        return f === c ? a(d, e, false) : a(d, f, e !== false);
    };
})(this);

//------------------------Sweet alert Start-----------------------------//
//document.getElementById('report-block').onclick = function () {
//    swal("Do you want to report or block the Trainer?");
//};
//------------------------Sweet alert End-----------------------------//

//---------------------- crossfit session book-------------------------//

$(document).ready(function () {
    $('[data-toggle="collapse"]').click(function () {
        $(this).toggleClass("active");
    });
    $('.button-left').click(function () {
        $('.sidebar').toggleClass('fliph');
    });
});

//---------------------- crossfit session book End-------------------------//

//---------------------- Profile Upload start-------------------------//
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function () {
    readURL(this);
});

//---------------------- Profile Upload End-------------------------//

//---------------------- Plus Minus Css Start-------------------------//

$(document).ready(function () {
    $('.minus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
    });
    $('.plus').click(function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });
});

//---------------------- Plus Minus Css End-------------------------//


// ------------- Toggle switch -------------------//

$('.btn-toggle').click(function () {
    $(this).find('.btn').toggleClass('active');

    if ($(this).find('.btn-primary').length > 0) {
        $(this).find('.btn').toggleClass('btn-primary');
    }
    $(this).find('.btn').toggleClass('btn-default');

});

$('form').submit(function () {
    var radioValue = $("input[name='options']:checked").val();
    if (radioValue) {
        alert("You selected - " + radioValue);
    };
    return false;
});


// ------------- Toggle switch End -------------------//

//-------------- light slider ------------------------//
$(document).ready(function () {
    $('#lightslider-demo').lightSlider({
        controls: false,
        item: 16,
        loop: false,
        pager: false,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    item: 4
                }
            }
        ]
    });
});

$(document).ready(function () {
    $('#lightslider-demo1').lightSlider({
        controls: false,
        item: 16,
        loop: false,
        pager: false,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    item: 4
                }
            }
        ]
    });
});

//-------------- light slider End---------------------//

//-------------- Add More Js start---------------------//

$(document).ready(function () {
    $(".add-more").click(function () {
        var html = $(".copy").html();
        $(".after-add-more").after(html);
    });
    $("body").on("click", ".remove", function () {
        $(this).parents(".control-group").remove();
    });
});

//-------------- Add More Js End---------------------//

//-------------- Password Js start---------------------//
$(".toggle-password").click(function () {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});
//-------------- Password Js End---------------------//
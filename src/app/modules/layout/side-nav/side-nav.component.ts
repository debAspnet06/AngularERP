import { Component, OnInit } from '@angular/core';
declare var $;
declare var PerfectScrollbar: any;
declare var feather: any;

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    function addscroller() {
      if ((rmmini(), menuclick(), $('.navbar-content')[0])) {
        new PerfectScrollbar('.navbar-content', {
          wheelSpeed: 0.5,
          swipeEasing: 0,
          suppressScrollX: !0,
          wheelPropagation: 1,
          minScrollbarLength: 40,
        });
      }
    }
    function menuclick() {
      $(window)[0].innerWidth;
      $('.pc-navbar li').off('click'),
        $('body').hasClass('minimenu') ||
          ($('.pc-navbar > li:not(.pc-caption)').on('click', function () {
            $(this).children('.pc-submenu').removeAttr('style'),
              $(this).hasClass('pc-trigger')
                ? ($(this).removeClass('pc-trigger'),
                  $(this).children('.pc-submenu').slideUp('fast'))
                : ($('li.pc-trigger').children('.pc-submenu').slideUp('fast'),
                  $('li.pc-trigger').removeClass('pc-trigger'),
                  $(this).addClass('pc-trigger'),
                  $(this).children('.pc-submenu').slideDown('fast'));
          }),
          $('.pc-navbar > li:not(.pc-caption) li').on('click', function (e) {
            e.stopPropagation(),
              $(this).hasClass('pc-trigger')
                ? ($(this).removeClass('pc-trigger'),
                  $(this).children('.pc-submenu').slideUp('fast'))
                : ($(this)
                    .parent('.pc-submenu')
                    .find('li.pc-trigger')
                    .children('.pc-submenu')
                    .slideUp('fast'),
                  $(this)
                    .parent('.pc-submenu')
                    .find('li.pc-trigger')
                    .removeClass('pc-trigger'),
                  $(this).addClass('pc-trigger'),
                  $(this).children('.pc-submenu').slideDown('fast'));
          }));
    }
    function rmdrp() {
      $('.pc-header:not(.pc-mob-header) .pc-mob-drp').removeClass(
        'mob-drp-active'
      ),
        $('.pc-header:not(.pc-mob-header) .pc-md-overlay').remove();
    }
    function rmthead() {
      $('.pc-header:not(.pc-mob-header)').removeClass('mob-header-active'),
        $('.pc-header:not(.pc-mob-header) .pc-md-overlay').remove();
    }
    function rmmenu() {
      $('.pc-sidebar').removeClass('mob-sidebar-active'),
        $('.topbar').removeClass('mob-sidebar-active'),
        $('.pc-sidebar .pc-menu-overlay').remove(),
        $('.topbar .pc-menu-overlay').remove();
    }
    function rmovermenu() {
      $('.pc-sidebar').removeClass('pc-over-menu-active'),
        $('.topbar').removeClass('mob-sidebar-active'),
        $('.pc-sidebar .pc-menu-overlay').remove(),
        $('.topbar .pc-menu-overlay').remove();
    }
    function rmactive() {
      $('.pc-sidebar .pc-navbar li').removeClass('active'),
        $('.pc-sidebar .pc-navbar li').removeClass('pc-trigger'),
        $('.topbar .dropdown').removeClass('show'),
        $('.topbar .dropdown-menu').removeClass('show'),
        $('.pc-sidebar .pc-menu-overlay').remove(),
        $('.topbar .pc-menu-overlay').remove();
    }
    function rmmini() {
      var e = $(window)[0].innerWidth;
      e <= 1024
        ? $('body').hasClass('minimenu') &&
          ($('body').removeClass('minimenu'), (flg = '1'))
        : e > 1024 &&
          '1' == flg &&
          ($('body').addClass('minimenu'), (flg = '0'));
    }
    var flg = '0';
    $(document).ready(function () {
      function e(e) {
        try {
          e.attr('placeholder').length;
        } catch (e) {
          0;
        }
        e.val().length > 0
          ? e.parent('.form-group').addClass('fill')
          : e.parent('.form-group').removeClass('fill');
      }
      feather.replace(),
        setTimeout(function () {
          $('.loader-bg').fadeOut('slow', function () {
            $(this).remove();
          });
        }, 400),
        $('body').hasClass('pc-horizontal') || addscroller(),
        $('.pc-horizontal').hasClass('navbar-overlay') && addscroller(),
        $('.hamburger:not(.is-active)').on('click', function () {
          $(this).hasClass('is-active')
            ? $(this).removeClass('is-active')
            : $(this).addClass('is-active');
        }),
        $('#overlay-menu').on('click', function () {
          menuclick(),
            $('.pc-sidebar').hasClass('pc-over-menu-active')
              ? rmovermenu()
              : ($('.pc-sidebar').addClass('pc-over-menu-active'),
                $('.pc-sidebar').append('<div class="pc-menu-overlay"></div>'),
                $('.pc-menu-overlay').on('click', function () {
                  rmovermenu(), $('.hamburger').removeClass('is-active');
                }));
        }),
        $('#mobile-collapse').on('click', function () {
          $('body').hasClass('pc-horizontal') || menuclick(),
            $('.pc-sidebar').hasClass('mob-sidebar-active')
              ? rmmenu()
              : ($('.pc-sidebar').addClass('mob-sidebar-active'),
                $('.pc-sidebar').append('<div class="pc-menu-overlay"></div>'),
                $('.pc-menu-overlay').on('click', function () {
                  rmmenu(), $('.hamburger').removeClass('is-active');
                }));
        }),
        $('.pc-horizontal #mobile-collapse').on('click', function () {
          $('.topbar').hasClass('mob-sidebar-active')
            ? rmmenu()
            : ($('.topbar').addClass('mob-sidebar-active'),
              $('.topbar').append('<div class="pc-menu-overlay"></div>'),
              $('.pc-menu-overlay').on('click', function () {
                rmmenu(), $('.hamburger').removeClass('is-active');
              }));
        }),
        $('#header-collapse').on('click', function () {
          $('.pc-header:not(.pc-mob-header)').hasClass('mob-header-active')
            ? rmthead()
            : ($('.pc-header:not(.pc-mob-header)').addClass(
                'mob-header-active'
              ),
              $('.pc-header:not(.pc-mob-header)').append(
                '<div class="pc-md-overlay"></div>'
              ),
              $('.pc-md-overlay').on('click', function () {
                rmthead();
              }));
        }),
        $('#headerdrp-collapse').on('click', function () {
          $('.pc-header:not(.pc-mob-header) .pc-mob-drp').hasClass(
            'mob-drp-active'
          )
            ? rmdrp()
            : ($('.pc-header:not(.pc-mob-header) .pc-mob-drp').addClass(
                'mob-drp-active'
              ),
              $('.pc-header:not(.pc-mob-header)').append(
                '<div class="pc-md-overlay"></div>'
              ),
              $('.pc-md-overlay').on('click', function () {
                rmdrp();
              }));
        }),
        $('.pc-horizontal .topbar .pc-navbar>li>a').on('click', function (e) {
          setTimeout(function () {
            $(this)
              .parents('.dropdown')
              .children('.dropdown-menu')
              .removeAttr('style');
          }, 1e3);
        }),
        $('.pc-horizontal .topbar .dropdown-menu a.dropdown-toggle').on(
          'click',
          function (e) {
            return (
              $(this)
                .parents('.dropdown-menu')
                .first()
                .find('.show')
                .removeAttr('style'),
              $(this).next().hasClass('show') ||
                $(this)
                  .parents('.dropdown-menu')
                  .first()
                  .find('.show')
                  .removeClass('show'),
              $(this).next('.dropdown-menu').toggleClass('show'),
              !1
            );
          }
        ),
        $('.form-v2 .form-control').each(function () {
          e($(this));
        }),
        $('.form-v2 .form-control').on('blur', function () {
          e($(this));
        }),
        $('.form-v2 .form-control').on('focus', function () {
          $(this).parent('.form-group').addClass('fill');
        });
    }),
      $(window).resize(function () {
        $('body').hasClass('pc-horizontal') || (rmmini(), menuclick()),
          $('body').hasClass('pc-horizontal') && rmactive();
      }),
      $(window).scroll(function () {}),
      $(window).on('load', function () {
        $('[data-toggle="tooltip"]').tooltip(),
          $('[data-toggle="popover"]').popover();
      }),
      $('.pc-sidebar .pc-navbar a').each(function () {
        var e = window.location.href.split(/[?#]/)[0];
        this.href == e &&
          '' != $(this).attr('href') &&
          ($(this).parent('li').addClass('active'),
          $(this)
            .parent('li')
            .parent()
            .parent('.pc-hasmenu')
            .addClass('active')
            .addClass('pc-trigger'),
          $(this).parent('li').parent().parent('.sidelink').addClass('active'),
          $(this)
            .parent('li')
            .parent()
            .parent('.pc-hasmenu')
            .parent()
            .parent('.pc-hasmenu')
            .addClass('active')
            .addClass('pc-trigger'),
          $(this).parents('.pc-tabcontent').addClass('active'));
      }),
      $('.tab-sidemenu>li').on('click', function () {
        var e = $(this).children('a').attr('data-cont');
        $('.navbar-content .pc-tabcontent').removeClass('active'),
          $('.tab-sidemenu > li').removeClass('active'),
          $(this).addClass('active'),
          $('.navbar-content .pc-tabcontent[data-value="' + e + '"]').addClass(
            'active'
          );
      });
  }
  // onLogoHandler() {
  //   const sessionUser = sessionStorage.getItem('username');
  //   console.log(sessionUser);
  // }
}

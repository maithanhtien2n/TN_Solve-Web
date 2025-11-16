import { _ as __nuxt_component_0, a as __nuxt_component_1, b as authService } from './PopupMessage-CHknC3mG.mjs';
import { _ as _export_sfc, g as useRoute$1, u as useRouter$1, f as useLocalePath, e as useI18n, k as __nuxt_component_2 } from './server.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, isRef, Fragment, renderList, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useDevice } from './index-BKshJpnN.mjs';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
import { E as EnumAccountRole } from './enum-kAdbNx_J.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DrawerSystem",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const route = useRoute$1();
    const router = useRouter$1();
    const localePath = useLocalePath();
    const { width, isMobile } = useDevice();
    const { onGetterUserData: userData } = useAppStore();
    const display = ref(false);
    const open = ref([]);
    computed(() => route.meta.layout || "");
    computed(() => {
      var _a;
      return (_a = route.name) == null ? void 0 : _a.toString().split("___")[0];
    });
    const menus = computed(() => {
      const items = [
        {
          title: "T\u1ED5ng quan",
          icon: "mdi-view-dashboard-outline",
          route: "/admin"
        },
        {
          role: [EnumAccountRole.ADMIN],
          title: "T\xE0i kho\u1EA3n",
          icon: "mdi-account-circle-outline",
          route: "accounts",
          children: [
            {
              title: "Ng\u01B0\u1EDDi d\xF9ng",
              route: "/admin/accounts/user"
            },
            {
              title: "Kh\xE1ch h\xE0ng",
              route: "/admin/accounts/customer"
            },
            {
              title: "C\u1ED9ng t\xE1c vi\xEAn",
              route: "/admin/accounts/partner"
            },
            {
              title: "Qu\u1EA3n tr\u1ECB vi\xEAn",
              route: "/admin/accounts/admin"
            }
          ]
        },
        {
          role: [EnumAccountRole.ADMIN],
          title: "Th\u01B0\u1EDBc phim",
          icon: "mdi-movie-open-outline",
          route: "videos",
          children: [
            {
              title: "\u0110ang t\u1EA1o",
              route: "/admin/videos/in-progress"
            },
            {
              title: "T\u1EA1o b\u1ECB l\u1ED7i",
              route: "/admin/videos/error"
            },
            {
              title: "Ho\xE0n th\xE0nh",
              route: "/admin/videos/complete"
            }
          ]
        },
        {
          role: [EnumAccountRole.ADMIN],
          title: "G\xF3i cho thu\xEA",
          icon: "mdi-package-variant-closed",
          route: "/admin/service-rentals"
        },
        // {
        //   title: "Quản lý dữ liệu",
        //   icon: "mdi-database-outline",
        //   route: "master-data",
        //   children: [
        //     {
        //       title: "Loại dịch vụ",
        //       route: "/admin/services/travels",
        //     },
        //   ],
        // },
        {
          role: [EnumAccountRole.ADMIN],
          title: "C\xE0i \u0111\u1EB7t",
          icon: "mdi-cog-outline",
          route: "settings",
          children: [
            // {
            //   title: "Loại dịch vụ",
            //   route: "/admin/services/travels",
            // },
          ]
        },
        // ------------------PARTNER--------------------
        {
          role: [EnumAccountRole.PARTNER],
          title: "T\u1ED5ng quan",
          icon: "mdi-view-dashboard-outline",
          route: "/partner"
        },
        {
          role: [EnumAccountRole.PARTNER],
          title: "Qu\u1EA3n l\xFD gi\u1EDBi thi\u1EC7u",
          icon: "mdi-account-group-outline",
          route: "my-referral",
          children: [
            {
              title: "Ng\u01B0\u1EDDi d\xF9ng",
              route: "/partner/my-referral/user"
            },
            {
              title: "Kh\xE1ch h\xE0ng",
              route: "/partner/my-referral/customer"
            }
          ]
        },
        {
          role: [EnumAccountRole.PARTNER],
          title: "L\u1ECBch s\u1EED giao d\u1ECBch",
          icon: "mdi-cash-clock",
          route: "/partner/transaction-history"
        },
        {
          role: [EnumAccountRole.PARTNER],
          title: "Thanh to\xE1n",
          icon: "mdi-credit-card-outline",
          route: "/partner/payment"
        },
        {
          role: [EnumAccountRole.ADMIN, EnumAccountRole.PARTNER],
          title: "Tool Video TN Solve",
          icon: "mdi-video-stabilization",
          route: "home"
        }
      ];
      return items.filter((x) => {
        var _a, _b;
        return (_b = x.role) == null ? void 0 : _b.includes((_a = userData.value) == null ? void 0 : _a.role);
      });
    });
    const onDisplay = (value) => {
      display.value = value;
    };
    const onSelectMenuItem = (event) => {
      if (event.id === "home") router.push(localePath("/"));
      else if (event.id) router.push(localePath(event.id));
    };
    const onClickLogout = () => {
      authService.logout().then(() => {
        (void 0).location.href = `/`;
      });
    };
    __expose({ onDisplay });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_navigation_drawer = resolveComponent("v-navigation-drawer");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_avatar = resolveComponent("v-avatar");
      const _component_v_img = resolveComponent("v-img");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_list_group = resolveComponent("v-list-group");
      const _component_v_overlay = resolveComponent("v-overlay");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_v_navigation_drawer, {
        modelValue: unref(display),
        "onUpdate:modelValue": ($event) => isRef(display) ? display.value = $event : null,
        location: "left",
        width: "270",
        temporary: Boolean(unref(width) < 1024),
        permanent: !Boolean(unref(width) < 1024),
        style: { "background": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", "z-index": "9999" }
      }, {
        prepend: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_list_item, { lines: "two" }, {
              prepend: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_avatar, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b, _c, _d;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_img, {
                          src: ((_a = unref(userData)) == null ? void 0 : _a.avatar) || "/images/avatar-default.jpg",
                          "lazy-src": ((_b = unref(userData)) == null ? void 0 : _b.avatar) || "/images/avatar-default.jpg"
                        }, {
                          placeholder: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_img, { src: "/images/avatar-default.jpg" }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_img, { src: "/images/avatar-default.jpg" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_img, {
                            src: ((_c = unref(userData)) == null ? void 0 : _c.avatar) || "/images/avatar-default.jpg",
                            "lazy-src": ((_d = unref(userData)) == null ? void 0 : _d.avatar) || "/images/avatar-default.jpg"
                          }, {
                            placeholder: withCtx(() => [
                              createVNode(_component_v_img, { src: "/images/avatar-default.jpg" })
                            ]),
                            _: 1
                          }, 8, ["src", "lazy-src"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_avatar, null, {
                      default: withCtx(() => {
                        var _a, _b;
                        return [
                          createVNode(_component_v_img, {
                            src: ((_a = unref(userData)) == null ? void 0 : _a.avatar) || "/images/avatar-default.jpg",
                            "lazy-src": ((_b = unref(userData)) == null ? void 0 : _b.avatar) || "/images/avatar-default.jpg"
                          }, {
                            placeholder: withCtx(() => [
                              createVNode(_component_v_img, { src: "/images/avatar-default.jpg" })
                            ]),
                            _: 1
                          }, 8, ["src", "lazy-src"])
                        ];
                      }),
                      _: 1
                    })
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b;
                if (_push3) {
                  _push3(`<div class="d-flex flex-column"${_scopeId2}><span${_scopeId2}>${ssrInterpolate((_a = unref(userData)) == null ? void 0 : _a.name)}</span></div>`);
                } else {
                  return [
                    createVNode("div", { class: "d-flex flex-column" }, [
                      createVNode("span", null, toDisplayString((_b = unref(userData)) == null ? void 0 : _b.name), 1)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_divider, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_list_item, { lines: "two" }, {
                prepend: withCtx(() => [
                  createVNode(_component_v_avatar, null, {
                    default: withCtx(() => {
                      var _a, _b;
                      return [
                        createVNode(_component_v_img, {
                          src: ((_a = unref(userData)) == null ? void 0 : _a.avatar) || "/images/avatar-default.jpg",
                          "lazy-src": ((_b = unref(userData)) == null ? void 0 : _b.avatar) || "/images/avatar-default.jpg"
                        }, {
                          placeholder: withCtx(() => [
                            createVNode(_component_v_img, { src: "/images/avatar-default.jpg" })
                          ]),
                          _: 1
                        }, 8, ["src", "lazy-src"])
                      ];
                    }),
                    _: 1
                  })
                ]),
                default: withCtx(() => {
                  var _a;
                  return [
                    createVNode("div", { class: "d-flex flex-column" }, [
                      createVNode("span", null, toDisplayString((_a = unref(userData)) == null ? void 0 : _a.name), 1)
                    ])
                  ];
                }),
                _: 1
              }),
              createVNode(_component_v_divider)
            ];
          }
        }),
        append: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_list, { nav: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_list_item, {
                    "prepend-icon": "mdi-logout",
                    value: "logout",
                    class: "text-red bg-white",
                    onClick: onClickLogout
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span${_scopeId3}>${ssrInterpolate(_ctx.$t("\u0110\u0103ng xu\u1EA5t"))}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(_ctx.$t("\u0110\u0103ng xu\u1EA5t")), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_list_item, {
                      "prepend-icon": "mdi-logout",
                      value: "logout",
                      class: "text-red bg-white",
                      onClick: onClickLogout
                    }, {
                      default: withCtx(() => [
                        createVNode("span", null, toDisplayString(_ctx.$t("\u0110\u0103ng xu\u1EA5t")), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_list, { nav: "" }, {
                default: withCtx(() => [
                  createVNode(_component_v_list_item, {
                    "prepend-icon": "mdi-logout",
                    value: "logout",
                    class: "text-red bg-white",
                    onClick: onClickLogout
                  }, {
                    default: withCtx(() => [
                      createVNode("span", null, toDisplayString(_ctx.$t("\u0110\u0103ng xu\u1EA5t")), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_list, {
              opened: unref(open),
              "onUpdate:opened": ($event) => isRef(open) ? open.value = $event : null,
              nav: "",
              "open-strategy": "single",
              "onClick:select": onSelectMenuItem
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(menus), (menu, index) => {
                    _push3(`<!--[-->`);
                    if (menu == null ? void 0 : menu.children) {
                      _push3(ssrRenderComponent(_component_v_list_group, {
                        value: menu.route
                      }, {
                        activator: withCtx(({ props }, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_v_list_item, mergeProps({ ref_for: true }, props, {
                              "prepend-icon": menu.icon
                            }), {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span${_scopeId4}>${ssrInterpolate(_ctx.$t(menu.title))}</span>`);
                                } else {
                                  return [
                                    createVNode("span", null, toDisplayString(_ctx.$t(menu.title)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_v_list_item, mergeProps({ ref_for: true }, props, {
                                "prepend-icon": menu.icon
                              }), {
                                default: withCtx(() => [
                                  createVNode("span", null, toDisplayString(_ctx.$t(menu.title)), 1)
                                ]),
                                _: 2
                              }, 1040, ["prepend-icon"])
                            ];
                          }
                        }),
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<!--[-->`);
                            ssrRenderList(menu.children, (i, idex) => {
                              _push4(ssrRenderComponent(_component_v_list_item, {
                                key: idex,
                                color: "primary",
                                active: unref(localePath)(i.route) == unref(route).fullPath,
                                value: i.route
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`<span${_scopeId4}>${ssrInterpolate(_ctx.$t(i.title))}</span>`);
                                  } else {
                                    return [
                                      createVNode("span", null, toDisplayString(_ctx.$t(i.title)), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            });
                            _push4(`<!--]-->`);
                          } else {
                            return [
                              (openBlock(true), createBlock(Fragment, null, renderList(menu.children, (i, idex) => {
                                return openBlock(), createBlock(_component_v_list_item, {
                                  key: idex,
                                  color: "primary",
                                  active: unref(localePath)(i.route) == unref(route).fullPath,
                                  value: i.route
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(_ctx.$t(i.title)), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["active", "value"]);
                              }), 128))
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(_component_v_list_item, {
                        color: "primary",
                        "prepend-icon": menu.icon,
                        value: menu.route,
                        active: unref(localePath)(menu.route) == unref(route).fullPath
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<span${_scopeId3}>${ssrInterpolate(_ctx.$t(menu.title))}</span>`);
                          } else {
                            return [
                              createVNode("span", null, toDisplayString(_ctx.$t(menu.title)), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(menus), (menu, index) => {
                      return openBlock(), createBlock(Fragment, { key: index }, [
                        (menu == null ? void 0 : menu.children) ? (openBlock(), createBlock(_component_v_list_group, {
                          key: 0,
                          value: menu.route
                        }, {
                          activator: withCtx(({ props }) => [
                            createVNode(_component_v_list_item, mergeProps({ ref_for: true }, props, {
                              "prepend-icon": menu.icon
                            }), {
                              default: withCtx(() => [
                                createVNode("span", null, toDisplayString(_ctx.$t(menu.title)), 1)
                              ]),
                              _: 2
                            }, 1040, ["prepend-icon"])
                          ]),
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(menu.children, (i, idex) => {
                              return openBlock(), createBlock(_component_v_list_item, {
                                key: idex,
                                color: "primary",
                                active: unref(localePath)(i.route) == unref(route).fullPath,
                                value: i.route
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, toDisplayString(_ctx.$t(i.title)), 1)
                                ]),
                                _: 2
                              }, 1032, ["active", "value"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["value"])) : (openBlock(), createBlock(_component_v_list_item, {
                          key: 1,
                          color: "primary",
                          "prepend-icon": menu.icon,
                          value: menu.route,
                          active: unref(localePath)(menu.route) == unref(route).fullPath
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, toDisplayString(_ctx.$t(menu.title)), 1)
                          ]),
                          _: 2
                        }, 1032, ["prepend-icon", "value", "active"]))
                      ], 64);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_list, {
                opened: unref(open),
                "onUpdate:opened": ($event) => isRef(open) ? open.value = $event : null,
                nav: "",
                "open-strategy": "single",
                "onClick:select": onSelectMenuItem
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(menus), (menu, index) => {
                    return openBlock(), createBlock(Fragment, { key: index }, [
                      (menu == null ? void 0 : menu.children) ? (openBlock(), createBlock(_component_v_list_group, {
                        key: 0,
                        value: menu.route
                      }, {
                        activator: withCtx(({ props }) => [
                          createVNode(_component_v_list_item, mergeProps({ ref_for: true }, props, {
                            "prepend-icon": menu.icon
                          }), {
                            default: withCtx(() => [
                              createVNode("span", null, toDisplayString(_ctx.$t(menu.title)), 1)
                            ]),
                            _: 2
                          }, 1040, ["prepend-icon"])
                        ]),
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(menu.children, (i, idex) => {
                            return openBlock(), createBlock(_component_v_list_item, {
                              key: idex,
                              color: "primary",
                              active: unref(localePath)(i.route) == unref(route).fullPath,
                              value: i.route
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, toDisplayString(_ctx.$t(i.title)), 1)
                              ]),
                              _: 2
                            }, 1032, ["active", "value"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["value"])) : (openBlock(), createBlock(_component_v_list_item, {
                        key: 1,
                        color: "primary",
                        "prepend-icon": menu.icon,
                        value: menu.route,
                        active: unref(localePath)(menu.route) == unref(route).fullPath
                      }, {
                        default: withCtx(() => [
                          createVNode("span", null, toDisplayString(_ctx.$t(menu.title)), 1)
                        ]),
                        _: 2
                      }, 1032, ["prepend-icon", "value", "active"]))
                    ], 64);
                  }), 128))
                ]),
                _: 1
              }, 8, ["opened", "onUpdate:opened"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(isMobile)) {
        _push(ssrRenderComponent(_component_v_overlay, {
          modelValue: unref(display),
          "onUpdate:modelValue": ($event) => isRef(display) ? display.value = $event : null,
          style: { "z-index": "9 !important" }
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layouts/DrawerSystem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppSystem",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    useRouter$1();
    useLocalePath();
    const { t } = useI18n();
    const { width } = useDevice();
    const { onGetterUserData, onActionGetUserData } = useAppStore();
    const { onActionAllMasterDataClient } = useMasterDataStore();
    const drawerSystemRef = ref();
    const loading = ref(true);
    computed(() => route.meta.layout || "");
    const userData = computed(() => onGetterUserData.value);
    const routeName = computed(() => {
      var _a;
      return (_a = route.name) == null ? void 0 : _a.toString().split("___")[0];
    });
    const breadcrumbs = computed(() => {
      const matched = route.matched.slice();
      if (matched.length === 1 && matched[0].path.includes("/admin/accounts")) {
        matched.unshift({
          path: "/admin/accounts",
          meta: { title: t("T\xE0i kho\u1EA3n") }
        });
      }
      if (matched.length === 1 && matched[0].path.includes("/admin/videos")) {
        matched.unshift({
          path: "/admin/videos",
          meta: { title: t("Th\u01B0\u1EDBc phim") }
        });
      }
      if (matched.length === 1 && matched[0].path.includes("/partner/my-referral")) {
        matched.unshift({
          path: "/partner/my-referral",
          meta: { title: t("Qu\u1EA3n l\xFD gi\u1EDBi thi\u1EC7u") }
        });
      }
      return [
        {
          // title: t("Trang chủ"),
          disabled: false,
          href: "/"
        },
        ...matched.map((item, index) => {
          var _a;
          return {
            title: t(((_a = item.meta) == null ? void 0 : _a.title) || ""),
            disabled: index === matched.length - 1
            // href: item.path,
          };
        })
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppLoading = __nuxt_component_0;
      const _component_v_layout = resolveComponent("v-layout");
      const _component_PopupMessage = __nuxt_component_1;
      const _component_v_main = resolveComponent("v-main");
      const _component_v_img = resolveComponent("v-img");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_breadcrumbs = resolveComponent("v-breadcrumbs");
      const _component_NuxtPage = __nuxt_component_2;
      if (unref(loading) || !unref(breadcrumbs) || !unref(breadcrumbs).length) {
        _push(ssrRenderComponent(_component_AppLoading, _attrs, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_v_layout, _attrs, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_PopupMessage, null, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$1, {
                ref_key: "drawerSystemRef",
                ref: drawerSystemRef
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_v_main, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a, _b, _c, _d;
                  if (_push3) {
                    _push3(`<div class="header px-4" data-v-23f40e7d${_scopeId2}><div class="d-flex align-center ga-2" data-v-23f40e7d${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_img, {
                      src: "/images/main-icon.png",
                      "lazy-src": "/images/tn-solve-icon.png",
                      style: { "width": "2.4rem" }
                    }, null, _parent3, _scopeId2));
                    _push3(`<h3 class="font-bold text-primary" data-v-23f40e7d${_scopeId2}>${ssrInterpolate((_b = (_a = unref(userData)) == null ? void 0 : _a.role) == null ? void 0 : _b.toUpperCase())}</h3></div>`);
                    if (Boolean(unref(width) < 1024)) {
                      _push3(ssrRenderComponent(_component_v_btn, {
                        icon: "",
                        variant: "text",
                        size: "44",
                        style: { "margin-right": "-0.7rem" },
                        onClick: ($event) => unref(drawerSystemRef).onDisplay(true)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_v_icon, { size: "30" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`mdi-menu`);
                                } else {
                                  return [
                                    createTextVNode("mdi-menu")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_v_icon, { size: "30" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-menu")
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="ma-4" data-v-23f40e7d${_scopeId2}>`);
                    if (!["admin", "partner"].includes(unref(routeName) || "")) {
                      _push3(ssrRenderComponent(_component_v_breadcrumbs, {
                        items: unref(breadcrumbs),
                        class: "mb-4"
                      }, {
                        prepend: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_v_icon, {
                              icon: "mdi-home-outline",
                              size: "20"
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_v_icon, {
                                icon: "mdi-home-outline",
                                size: "20"
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(_component_NuxtPage, null, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "header px-4" }, [
                        createVNode("div", { class: "d-flex align-center ga-2" }, [
                          createVNode(_component_v_img, {
                            src: "/images/main-icon.png",
                            "lazy-src": "/images/tn-solve-icon.png",
                            style: { "width": "2.4rem" }
                          }),
                          createVNode("h3", { class: "font-bold text-primary" }, toDisplayString((_d = (_c = unref(userData)) == null ? void 0 : _c.role) == null ? void 0 : _d.toUpperCase()), 1)
                        ]),
                        Boolean(unref(width) < 1024) ? (openBlock(), createBlock(_component_v_btn, {
                          key: 0,
                          icon: "",
                          variant: "text",
                          size: "44",
                          style: { "margin-right": "-0.7rem" },
                          onClick: ($event) => unref(drawerSystemRef).onDisplay(true)
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { size: "30" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-menu")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "ma-4" }, [
                        !["admin", "partner"].includes(unref(routeName) || "") ? (openBlock(), createBlock(_component_v_breadcrumbs, {
                          key: 0,
                          items: unref(breadcrumbs),
                          class: "mb-4"
                        }, {
                          prepend: withCtx(() => [
                            createVNode(_component_v_icon, {
                              icon: "mdi-home-outline",
                              size: "20"
                            })
                          ]),
                          _: 1
                        }, 8, ["items"])) : createCommentVNode("", true),
                        createVNode(_component_NuxtPage)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_PopupMessage),
                createVNode(_sfc_main$1, {
                  ref_key: "drawerSystemRef",
                  ref: drawerSystemRef
                }, null, 512),
                createVNode(_component_v_main, null, {
                  default: withCtx(() => {
                    var _a, _b;
                    return [
                      createVNode("div", { class: "header px-4" }, [
                        createVNode("div", { class: "d-flex align-center ga-2" }, [
                          createVNode(_component_v_img, {
                            src: "/images/main-icon.png",
                            "lazy-src": "/images/tn-solve-icon.png",
                            style: { "width": "2.4rem" }
                          }),
                          createVNode("h3", { class: "font-bold text-primary" }, toDisplayString((_b = (_a = unref(userData)) == null ? void 0 : _a.role) == null ? void 0 : _b.toUpperCase()), 1)
                        ]),
                        Boolean(unref(width) < 1024) ? (openBlock(), createBlock(_component_v_btn, {
                          key: 0,
                          icon: "",
                          variant: "text",
                          size: "44",
                          style: { "margin-right": "-0.7rem" },
                          onClick: ($event) => unref(drawerSystemRef).onDisplay(true)
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { size: "30" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-menu")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "ma-4" }, [
                        !["admin", "partner"].includes(unref(routeName) || "") ? (openBlock(), createBlock(_component_v_breadcrumbs, {
                          key: 0,
                          items: unref(breadcrumbs),
                          class: "mb-4"
                        }, {
                          prepend: withCtx(() => [
                            createVNode(_component_v_icon, {
                              icon: "mdi-home-outline",
                              size: "20"
                            })
                          ]),
                          _: 1
                        }, 8, ["items"])) : createCommentVNode("", true),
                        createVNode(_component_NuxtPage)
                      ])
                    ];
                  }),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layouts/AppSystem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppSystem = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-23f40e7d"]]);

export { AppSystem as A };
//# sourceMappingURL=AppSystem-DsQOCQqL.mjs.map

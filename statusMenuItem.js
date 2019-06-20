/*
 * Spruce
 *
 * Copyright (c) 2019 Payson Wallach
 *
 * Released under the terms of the GNU General Public License, version 3
 * (https://gnu.org/licenses/gpl.html)
 */

const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;

const settings = spruce.imports.convenience.getSettings();
const positions = ["top", "top-right", "right", "bottom-right", "bottom",
                   "bottom-left", "left", "top-left", "left-display",
                   "right-display", "maximize", "center"];


const StatusMenuItem = class StatusMenuItem {
  constructor() {
    this.button = new PanelMenu.Button(0, "spruce-menu", false);

    let box = new St.BoxLayout();
    let gIcon = Gio.icon_new_for_string(
      spruce.path +
        "/icons/spruce.svg"
    );
    let icon = new St.Icon({ gicon: gIcon, style_class: "system-status-icon" });

    box.add(icon);
    this.button.actor.add_child(box);

    for (const position of positions) {
        let handler = function() {
            Util.spawn(["arrange", position]);
        };
        let menuItem = new PopupMenu.PopupMenuItem(position.capitalize());

        menuItem.connect("activate", Lang.bind(this, handler));
        this.button.menu.addMenuItem(menuItem);
        Main.wm.addKeybinding(
          position,
          settings,
          Meta.KeyBindingFlags.NONE,
          Shell.ActionMode.NORMAL,
          handler
        );
    }
  }

  enable() {
    Main.panel.addToStatusArea("spruce-menu", this.button, 0, "right");
  }

  disable() {
    this.button.destroy();

    for (const position of positions) {
      Main.wm.removeKeybinding(position);
    }
  }
};

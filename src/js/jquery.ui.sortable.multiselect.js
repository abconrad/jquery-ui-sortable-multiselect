/*jslint browser:true, nomen:true, devel:true */
/*global document, jQuery */
/*
 * jQuery UI Sortable Connect Multi-Select v0.2
 * Copyright (c) 2013 Bart Conrad
 *
 * http://hippomanager.com/posts/plugins/
 *
 * Depends:
 *   - jQuery 1.7.2+
 *   - jQuery UI 1.9.1 widget factory
 *
 * Licensed under the GPL licenses:
 *   http://www.gnu.org/licenses/gpl.html
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function ($) {
    "use strict";

    /**
     * ui.sortable
     *
     * Extends the jQuery UI Sortable plugin adding the ability to connect the
     * sortable to a multiselect element
     */
    $.widget('ui.sortable', $.ui.sortable, {
        options: {
            connectMultiSelect:     null
        },
        _create: function () {
            var self = this,
                el = self.element,
                o = self.options;

            //Global vars
            self.multiSelect = $(o.connectMultiSelect);
            self.userReceive = o.receive || $.noop;
            self.userRemove = o.remove || $.noop;
            self.userStop = o.stop || $.noop;

            // Replace the built in receive callback with our custom
            // function self._receive()
            o.receive = function (e, ui) {
                self._receive(
                    e,
                    ui,
                    function (e, ui) {
                        self.userReceive(e, ui);
                    }
                );
            };

            // Replace the built in remove callback with our custom
            // function self._remove()
            o.remove = function (e, ui) {
                self._remove(
                    e,
                    ui,
                    function (e, ui) {
                        self.userRemove(e, ui);
                    }
                );
            };

            // Replace the built in stop callback with our custom
            // function self._stop()
            o.stop = function (e, ui) {
                self._stop(
                    e,
                    ui,
                    function (e, ui) {
                        self.userStop(e, ui);
                    }
                );
            };

            self._connectMultiSelect();
            self._super();
        },
        /**
         * Convenience method for self.updateSelect
         *
         * @param {event} e
         * @param {object} ui
         * @param {callback} onSelectReceive
         */
        _receive: function (e, ui, onSelectReceive) {
            var self = this;

            self.updateSelect();
            onSelectReceive();
            self._trigger('selectreceive', e, ui);
        },
        /**
         * Convenience method for self.updateSelect
         *
         * @param {event} e
         * @param {object} ui
         * @param {callback} onSelectRemove
         */
        _remove: function (e, ui, onSelectRemove) {
            var self = this;

            self.updateSelect();
            onSelectRemove();
            self._trigger('selectremove', e, ui);
        },
        /**
         * Convenience method for self.updateSelect
         *
         * @param {event} e
         * @param {object} ui
         * @param {callback} onSelectStop
         */
        _stop: function (e, ui, onSelectStop) {
            var self = this;

            self.updateSelect();
            onSelectStop();
            self._trigger('selectstop', e, ui);
        },
        /**
         * If the multi select element exists in the DOM this hides it then
         * adds an "li" to the sortable element for every option in the
         * multiselect.
         *
         * It adds a "selectVal" data value to those "li's" to hold the
         * value of the option.
         */
        _connectMultiSelect: function () {
            var self = this,
                el = self.element,
                o = self.options,
                styleClass;

            //multiselect exists in DOM
            if (self.multiSelect.length > 0) {
                self.multiSelect.hide();

                //If there are items in the multiselect element those values
                //are used to populate the sortable element.  If not the
                //sortable's elements are used to populate the multiselect.
                if (self.multiSelect.find('option').length > 0) {
                    //Marks all elements in the select element as selected
                    self.multiSelect.find('option')
                        .attr('selected', 'selected');

                    //Adds an "li" to the sortable element for every option in
                    //the multiselect
                    self.multiSelect.find('option').each(function (i, v) {
                        styleClass = o.styleClass || $(this).data('liClass');

                        el.append(
                            $('<li/>')
                                .html($(v).html())
                                .addClass(styleClass)
                                .data('selectVal', $(v).val())
                        );
                    });
                } else {
                    self.updateSelect();
                }

            }
        },
        /**
         * If the multiselect exists in the DOM this updates its options to
         * match the "li's" in the sortable element.
         */
        updateSelect: function () {
            var self = this,
                el = self.element;

            //multiselect exists in DOM
            if (self.multiSelect.length > 0) {
                self.multiSelect.find('option').remove();

                //Updates the multiselect element's options to match the "li's"
                //in the sortable element.
                el.find('li').each(function (i, v) {
                    self.multiSelect.append(
                        $('<option/>')
                            .val($(this).data('selectVal'))
                            .attr('label', $(this).html())
                            .html($(this).html())
                            .attr('selected', 'selected')
                    );
                });
            }
        },
        _destroy: function () {
            var self = this;

            //multiselect exists in DOM
            if (self.multiSelect.length > 0) {
                self.multiSelect.show();
            }

            self._super();
        }
    });
}(jQuery));
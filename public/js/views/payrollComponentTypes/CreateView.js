define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/payrollComponentTypes/CreateTemplate.html',
    'models/PayrollComponentTypeModel',
    'common',
    'populate',
    'dataService',
    'constants'
], function ($, _, Backbone, CreateTemplate, PayrollComponentTypeModel, common, populate, dataService, CONSTANTS) {

    var CreateView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'payrollComponentTypes',
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            var self = this;

            self.type = options.type;
            self.eventChannel = options.eventChannel;

            self.render();
        },

        saveItem: function () {
            var self = this;
            var model;
            var $currentEl = this.$el;
            var name = $.trim($currentEl.find('#payrollComponentTypeName').val());
            var description = $currentEl.find('#payrollComponentTypeComment').val();
            var data = {
                name       : name,
                description: description,
                type       : self.type
            };

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'name can\'t be empty'
                });
            }

            model = new PayrollComponentTypeModel();
            model.urlRoot = function () {
                return 'payrollComponentTypes';
            };

            model.save(data, {
                patch  : true,
                headers: {
                    mid: 103
                },
                wait   : true,
                success: function () {
                    self.hideDialog();

                    if (self.type === 'deductions') {
                        self.eventChannel.trigger('updatePayrollDeductionsType');
                    } else if (self.type === 'earnings') {
                        self.eventChannel.trigger('updatePayrollEarningsType');
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = this.template({type: self.type});

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Create',
                width        : '900px',
                position     : {within: $('#wrapper')},
                buttons      : [
                    {
                        id   : 'create-weeklyScheduler-dialog',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});

define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/DealTasks/dateList/ListHeader.html',
    'text!templates/DealTasks/dateList/dateItemTemplate.html',
    'views/DealTasks/CreateView',
    'views/DealTasks/EditView',
    'models/DealTasksModel',
    'views/Filter/filterView',
    'moment'
], function (Backbone, $, _,  paginationTemplate, listTemplate, dateItemTemplate, CreateView, EditView, CurrentModel, FilterView, moment) {
    var TasksListView = Backbone.View.extend({
        el        : '#content-holder',
        CreateView              : CreateView,
        listTemplate            : listTemplate,
        filterView              : FilterView,
        hasPagination           : true,
        contentType             : 'DealTasks',

        events: {
            'click div.dateListItem'    : 'goToEditDialog',
            'click .stageSelectType'    : 'showNewSelectType',
            'click .newSelectList li'   : 'chooseOption',
            'mousedown ._customCHeckbox': 'checked'
        },

        initialize: function (options) {
            $(document).off('click');
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.filter = options.filter;
            this.render();
        },

        goToEditDialog: function (e) {
            var id;
            var model;

            e.preventDefault();

            id = $(e.target).closest('.dateListItem').attr('data-id');
            model = new CurrentModel({validate: false});

            model.urlRoot = '/dealTasks/';
            model.fetch({
                data   : {id: id, viewType: 'form'},
                success: function (newModel) {
                    new EditView({model: newModel});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        checked: function (e) {
            var $target = $(e.target).parent('label');

            var input = $target.find('input');
            var id = $target.closest('.dateListItem').attr('data-id');
            var workflow = input.val();
            var sequence = input.attr('data-sequence');
            var model = new CurrentModel({_id : id});

            e.stopPropagation();

            if (input.prop('checked')){
                return false;
            }

            model.save({sequenceStart : sequence, workflow : '5783b351df8b918c31af24ab', sequence : -1, workflowStart : workflow},{patch : true, validate: false,
            success : function(){
                input.prop('checked', true);
            }});

        },

        createItem: function () {
            var CreateView = this.CreateView || Backbone.View.extend({});
            var startData = {};
            var cid;
            var model;

            this.CurrentModel = this.CurrentModel || Backbone.Model.extend();
            model = new this.CurrentModel();

            cid = model.cid;

            startData.cid = cid;

            if (this.editCollection) {
                this.changed = true;
                this.showSaveCancelBtns();
                this.editCollection.add(model);
            }


            return new CreateView(model);
        },

        showNewSelectType: function (e) {
            var targetElement;

            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
            } else {
                targetElement = $(e.target).parents('td');
                targetElement.find('.newSelectList').show();
            }

            return false;
        },

        render: function () {
            var collection = this.collection.toJSON()[0];
            var key;

            $('.ui-dialog ').remove();


            this.$el.html(_.template(listTemplate));

            for (key in collection){
                this.$el.find('#dateList').append(_.template(dateItemTemplate, {moment : moment,data : collection[key], type : key}));
            }

          /*  itemView.bind('incomingStages', this.pushStages, this);
            $currentEl.append(itemView.render());

            common.populateWorkflowsList('DealTasks', '.filter-check-list', '#workflowNamesDd', '/Workflows', null, function (stages) {
                var stage = (self.filter) ? self.filter.workflow || [] : [];

                itemView.trigger('incomingStages', stages);
            });*/
        }

    });

    return TasksListView;
});

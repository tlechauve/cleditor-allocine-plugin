(function ($) {
    // Handle the allocine button click event
    var movieClick = function (e, data) {
        // Wire up the submit button click event
        $(data.popup).children('input#searchmovie').keyup(function () {
            var $this = $(this);
            if ($this.data('timeout')) {
                clearTimeout($this.data('timeout'));
            }
            $this.data('timeout', setTimeout(function () {
                var value = $this.val().trim().toLowerCase();
                if (value.length > 1) {
                    $("#movielist").html('').allocine('searchMovie', value, {
                        success: function (response) {
                            var $this = $(this);
                            if (response.feed.count > 1) {
                                $this.html(Mustache.render($.tplallocine.movieitem, response.feed));
                                $this.find('li').click(function (){
                                    showMovie($(this).data('idcode'), data);
                                });
                            }
                        }
                    });
                } else {
                    $("#movielist").html('');
                }
            }, 500));
        });
    },
        showMovie = function (code, data) {
            var editor = data.editor;
            
            $(editor).allocine('getMovie', code, {
                success: function (response) {
                    editor.execCommand(data.command, Mustache.render($.tplallocine.movie, response.movie), null, data.button);
                }
            });

            editor.hidePopups();
            editor.focus();
        };

    $.cleditor.buttons.movie = {
        name: 'movie',
        image: 'allocine.png',
        title: 'Créer une fiche de film',
        command: 'inserthtml',
        popupName: 'movie',
        popupClass: 'cleditorPrompt',
        popupContent: $.tplallocine.popup,
        buttonClick: movieClick
    };
    // Add the button to the default controls before the bold button
    $.cleditor.defaultOptions.controls = $.cleditor.defaultOptions.controls
        .replace('bold', 'movie bold');
}(jQuery));

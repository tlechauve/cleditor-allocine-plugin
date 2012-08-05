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
                    var style = $.tplallocine.movie.substr(0, ($.tplallocine.movie.indexOf('</style>') + 8)),
                        tpl = $.tplallocine.movie.replace(style, ''),
                        relgroup = response.movie.release.releaseDate.split('-'),
                        months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
                        rel = [relgroup[2], months[parseInt(relgroup[1], 10) - 1], relgroup[0]].join(' ');
                    response.movie.release.releaseDate = rel;
                    response.movie.runtime = '' + Math.floor(response.movie.runtime / 3600) + 'h' + ((response.movie.runtime % 3600) / 60);
                    $(editor.doc.head).html(style);
                    editor.execCommand(data.command, Mustache.render(tpl, response.movie), null, data.button);
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

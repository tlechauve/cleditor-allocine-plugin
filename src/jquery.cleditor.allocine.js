(function ($) {
    $.tplallocine = {
        movie: '<style>.moviecontainer {background-color: #e6e6e6;height: 300px;font-size: 0.9em;}.moviecontainer img {height: inherit;vertical-align: middle;}.moviedescription {padding: 10px 20px 10px 20px;height: 280px;overflow: auto;color: #1F1F1F;line-height: "120%";}.moviedescription .movietitle {font-size: 1.2em;font-weight: bold;text-decoration: underline;}.moviedescription table {margin: 20px 0px 20px 0px;}.moviedescription table td {min-width: 90px;}.moviesynopsis {font-style: italic;padding: 10px;margin-top: 20px;background-color: white;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;-moz-box-shadow: 5px 6px 13px #000000;-webkit-box-shadow: 5px 6px 13px #000000;box-shadow: 5px 6px 13px #000000;font-size: 0.9em;}</style><div class="moviecontainer"><img src="{{poster.href}}" align="left"/><div class="moviedescription"><span class="movietitle">{{# title }} {{ title }} {{/ title }}{{^ title }} {{ originalTitle }} {{/ title }}</span><table><tr><td>Réalisateur</td><td>{{castingShort.directors}}</td></tr><tr><td>Acteurs</td><td>{{castingShort.actors}}, ...</td></tr><tr><td>Date de sortie</td><td>{{release.releaseDate}}</td></tr><tr><td>Durée</td><td>{{runtime}}</td></tr></table><div class="moviesynopsis">{{synopsis}}</div></div></div>',
        movieitem: '<style>.movieitem {height: 50px;min-width: 200px;background-color: #efefef;margin: 1px 0px 1px 0px;}.movieitem:hover {background-color: #e0e0e0;cursor: pointer;}.movieitemdesc {color: black;margin-left: 40px;padding: 2px 10px 10px 2px;font-size: 0.9em;line-height: 180%;}.movieitem img {height: inherit;}.movietitle {font-size: 1.1em;font-weight: bold;}.movieyear {font-style: italic;}</style>{{# movie }}<li class="movieitem" data-idcode="{{ code }}"><img src="{{ poster.href }}" align="left"/><div class="movieitemdesc"><span class="movietitle">{{# title }} {{ title }} {{/ title }}{{^ title }} {{ originalTitle }} {{/ title }}</span><span class="movieyear">({{ productionYear }})</span><br/>de {{ castingShort.directors }}</div></li>{{/ movie }}',
        popup: '<style>#movielist {list-style: none;-webkit-padding-start: 0px;-webkit-margin-before: 0em;-webkit-margin-after: 0em;}</style><input type="text" id="searchmovie" placeholder="nom du film"/><ul id="movielist"></ul>'
    };
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

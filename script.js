Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: "#app",
    data: {
        loading: false,
        searchEntry: '',
        definitionList: [],
        thesaurus: [],
        thesError: '.',
    },
    methods: {
        async searchWord() {
            try {
                this.definitionList = [];
                this.thesaurus = [];
                this.thesError = '.';
                if (this.searchEntry === '')
                {
                    return;
                }
                this.loading = true;
                const response = await axios.get('https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + this.searchEntry + '?key=d33ff619-479e-42ba-ad0d-f1f577b0e4df');
                console.log(response);
                var tempError = '';
                for (i in response.data)
                {
                    var tempDate = 'Unknown';
                    var tempSpeechPart = 'Unknown';
                    var tempOffensive = '';
                    var tempShortDefs = '';
                    var tempName = '';

                    if (response.data[i].date !== undefined) {
                        tempDate = response.data[i].date;
                        var pos = tempDate.indexOf("{");
                        if (pos !== -1) {
                            var res = tempDate.slice(0, pos);
                            tempDate = res;
                        }
                    }
                    if (response.data[i].fl !== undefined) {
                        tempSpeechPart = response.data[i].fl;
                    }
                    if ((response.data[i].meta !== undefined) && (response.data[i].meta.offensive !== undefined)) {
                        tempOffensive = response.data[i].meta.offensive;
                    }
                    if (response.data[i].shortdef !== undefined) {
                        tempShortDefs = response.data[i].shortdef;
                        var letters = /^[A-Za-z]+$/;
                        for (j in tempShortDefs) {
                            if(!tempShortDefs[j].charAt(0).match(letters))
                            {
                                tempShortDefs[j] = tempShortDefs[j].slice(1);
                            }
                        }
                    }

                    if ((response.data[i].meta !== undefined) && (response.data[i].meta.id !== undefined)) {
                        tempName = response.data[i].meta.id;
                        var pos = tempName.indexOf(":");
                        if (pos !== -1) {
                            var res = tempName.slice(0, pos);
                            tempName = res;
                        }
                    }

                    if ((tempDate === 'Unknown') && (tempOffensive === '') && (tempSpeechPart === 'Unknown') && (tempShortDefs === '')) {
                        this.definitionList.push({
                            error: "We're sorry, that word cannot be defined. Did you mean to type one of the following words?",
                            suggestions: response.data,
                        })
                        break;
                    }

                    this.thesError = '';

                    this.definitionList.push({
                        date: tempDate,
                        speechPart: tempSpeechPart,
                        offensive: tempOffensive,
                        shortDefs: tempShortDefs,
                        word: tempName,
                        error: tempError,
                        suggestions: [],
                    });
                }
                const responseth = await axios.get('https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + this.searchEntry + '?key=ddc164f6-e086-4fda-898a-76cd24669771');
                console.log(responseth);
                for (i in responseth.data)
                {
                    var tempSyns = [];
                    var tempAnts = [];
                    var tempName = '';
                    var tempSpeechPart = 'Unknown';
                    
                    if ((responseth.data[i].meta !== undefined) && (responseth.data[i].meta.id !== undefined)) {
                        tempName = responseth.data[i].meta.id;
                        var pos = tempName.indexOf(":");
                        if (pos !== -1) {
                            var res = tempName.slice(0, pos);
                            tempName = res;
                        }
                    }
                    
                    if (responseth.data[i].fl !== undefined) {
                        tempSpeechPart = responseth.data[i].fl;
                    }

                    if ((responseth.data[i].meta !== undefined) && (responseth.data[i].meta.ants !== undefined))
                    {
                        for (k in responseth.data[i].meta.ants[0]) {
                            tempAnts.push(responseth.data[i].meta.ants[0][k]);
                        }
                    }

                    if ((responseth.data[i].meta !== undefined) && (responseth.data[i].meta.syns !== undefined))
                    {
                        for (k in responseth.data[i].meta.syns[0]) {
                            tempSyns.push(responseth.data[i].meta.syns[0][k]);
                        }
                    }

                    if ((tempAnts.length == 0) && (tempSpeechPart === 'Unknown') && (tempSyns.length == 0)) { 
                        break;
                    }

                    this.thesaurus.push({
                        speechPart: tempSpeechPart,
                        word: tempName,
                        Ants: tempAnts,
                        Syns: tempSyns,
                        error: tempError,
                    });

                }

                this.loading = false;
                searchEntry = '';
            } catch (error) {
                console.log(error);
            }
        },
    },
});
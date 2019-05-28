Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: "#app",
    data: {
        loading: false,
        searchEntry: '',
        definitionList: [],
    },
    methods: {
        async searchWord() {
            try {
                this.definitionList = [];
                this.loading = true;
                const response = await axios.get('https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + this.searchEntry + '?key=d33ff619-479e-42ba-ad0d-f1f577b0e4df');
                console.log(response);
                for (i in response.data)
                {
                    var tempDate = '';
                    var tempSpeechPart = '';
                    var tempOffensive = '';
                    var tempShortDefs = '';

                    if (response.data[i].date !== undefined) {
                        tempDate = response.data[i].date;
                    }
                    if (response.data[i].fl !== undefined) {
                        tempSpeechPart = response.data[i].fl;
                    }
                    if ((response.data[i].meta !== undefined) && (response.data[i].meta.offensive !== undefined)) {
                        tempOffensive = response.data[i].meta.offensive;
                    }
                    if (response.data[i].shortdef !== undefined) {
                        tempShortDefs = response.data[i].shortdef;
                    }

                    if ((tempDate === '') && (tempOffensive === '') && (tempSpeechPart === '') && (tempShortDefs === '')) {
                        tempDate = "We're sorry, that word cannot be defined. Did you mean to type one of the following words?";
                        tempShortDefs = response.data;

                        this.definitionList.push({
                            date: tempDate,
                            speechPart: tempSpeechPart,
                            offensive: tempOffensive,
                            shortDefs: tempShortDefs,
                        })

                        break;
                    }

                    this.definitionList.push({
                        date: tempDate,
                        speechPart: tempSpeechPart,
                        offensive: tempOffensive,
                        shortDefs: tempShortDefs,
                    });
                    
                    //Fix dates by checking for {} type of info at the end
                    //Fix if bolded statements show up based on if the category is empty
                    //Add thesaurus functionality or something in the side bar
                    //Get rid of bullet points on the lists - change them to something else maybe
                    //Add button to filter words that can be defined based on if offensive
                    //Obviously stylize stuff - better fonts, spacing, colors
                
                }
                this.loading = false;
                searchEntry = '';
            } catch (error) {
                console.log(error);
            }
        },
    },
});
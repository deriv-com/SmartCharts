
   @action.bound init(activeLanguages) {
        if (activeLanguages) {
            this.languages = activeLanguages
                .map(lngKey => languageList.find(lng => lng.key.toUpperCase() === lngKey) || null)
                .filter(x => x);
            this.language = this.languages[0];
        } else {
            this.languages = languageList;
            this.language = this.languages[0];
        }

        // set default language as the first item of active languages or Eng
        this.defaultLanguage = this.languages[0] || languageList[0];
    }

    @action.bound updateProps(activeLanguages) {

      const languages = this.languages.map(x => x.toUpperCase());
      console.log(languages);
      console.log(activeLanguages);
      if (languages !== activeLanguages) {
        console.log('should updated');
      }
       // if (activeLanguages) {
       //     this.languages = activeLanguages
       //         .map(lngKey => languageList.find(lng => lng.key.toUpperCase() === lngKey) || null)
       //         .filter(x => x);
       // } else {
       //     this.languages = languageList;
       // }

       // if (this.language) {
       //     // todo
       // } else {
       //     this.language = this.languages[0];
       // }


       // // set default language as the first item of active languages or Eng
       // this.defaultLanguage = this.languages[0] || languageList[0];
   }

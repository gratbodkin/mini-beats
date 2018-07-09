

class Ticker {
    constructor(inContext)
    {
        this._context = inContext;
        this.tempo = 100;
    }

    setTempo(inTempo)
    {
        this.tempo = inTempo;
    }


    setSwing()
    {

    }

    getTempo()
    {
        return this.tempo;
    }

    fullNote()
    {
        return 60 / this.getTempo();
    }

    halfNote()
    {
        return this.fullNote() / 2;
    }

    quarterNote()
    {
        return this.halfNote() / 2;
    }

    eighthNote()
    {
        return this.quarterNote() / 2;
    }

    sixteenthNote()
    {
        return this.eighthNote() / 2;
    }

}

import * as Mingo from 'mingo';

/**
 * DocumentUpdator
 * ...
 */
export class DocumentUpdator {
    /**
     * _updateDocuments
     * ...
     */
    public updateDocuments( docs: any[], changes: any ) {
        docs.forEach( doc => this.updateDocument( doc, changes ));
    }

    /**
     * _updateDocument
     * ...
     *
     * @todo also apply changes in nested fields
     */
    public updateDocument( doc: any, changes: any ) {
        if ( changes.$set ) {
            const clean$Set = this._cleanObject( changes.$set );
            Object.assign( doc, clean$Set );
        }
        if ( changes.$push ) {
            const clean$Push = this._cleanObject( changes.$push );
            Object.keys( clean$Push ).forEach( key => {
                const val = clean$Push[ key ];
                if ( !doc[ key ] || !Array.isArray( doc[ key ])) {
                    doc[ key ] = [];
                }
                doc[ key ].push( val );
            });
        }
        if ( changes.$pull ) {
            const clean$Pull = this._cleanObject( changes.$pull );
            Object.keys( clean$Pull ).forEach( key => {
                const val = clean$Pull[ key ];
                const docVal = doc[ key ];
                if ( !docVal || !Array.isArray( docVal )) {
                    return;
                }
                if ( val && val.$elemMatch ) {
                    const matches = this._filterDocuments( val.$elemMatch, docVal );
                    doc[ key ] = docVal.filter( elem => matches.indexOf( elem ) === -1 );
                } else {
                    doc[ key ] = docVal.filter( elem => elem !== val );
                }
            });
        }
    }

    /**
     * _cleanObject
     * ...
     */
    protected _cleanObject( doc: any ): any {
        const str = JSON.stringify( doc );
        return JSON.parse( str );
    }

    /**
     * _filterDocuments
     * ...
     */
    protected _filterDocuments( filter: any, docs: any[]): any[] {
        const query = new Mingo.Query( filter );
        return query.find( docs ).all();
    }
}

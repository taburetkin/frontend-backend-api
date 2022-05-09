# frontend-backend-api
Designed for sinchronization frontend data with backend data.  
Was inspired by idea to take out synchronization api from backbone collection and model.


## Usecases
```js
import backend from 'my-backend-instance';
import dataModel from 'my-data-model';

// Fetch data from backend and synchronize dataModel
backend.fetch(dataModel); 

// Sends new data to backend
backend.save(dataModel);

// delete the model on backend and destroy the modelData on success.
backend.delete(dataModel);

```

## Default implementation
Is ready for use and backend communications are based on `fetch`
```js
import { BackendApi } from 'frontend-backend-api';
export const backend = new BackendApi();
```

## Using jQuery ajax
By default you may omit `buildSendRequestArguments`
```js
import { BackendApi } from 'frontend-backend-api';
import $ from 'jquery';
export const jqueryBackend = new BackendApi({ jquerySend: $.ajax });
```

But in case you need your own, just provided it:

```js
import { BackendApi } from 'frontend-backend-api';
import $ from 'jquery';

function buildSendRequestArguments(options) {
    let args = [];
    // prepare arguments by your own
    // if you need default arguments you can call super
    // in case of jquery it will produce array with jquery ajax options
    // otherweise fetch options
    

    return args;
}

export const backend = new BackendApi({ jquerySend: $.ajax, buildSendRequestArguments });
```

## Using Backbone.sync

By default you may omit `buildSendRequestArguments`

```js
import { BackendApi } from 'frontend-backend-api';
import Backbone from 'backbone';

export const backboneBackend = new BackendApi({ sendRequest: Backbone.sync });

```

In case you need own `buildSendRequestArguments` just provide it

```js
import { BackendApi } from 'frontend-backend-api';
import Backbone from 'backbone';

function buildSendRequestArguments(options)
{
    // to do: explain better the case with Backbone.sync
    return [method, model, options]
}

export const backboneBackend = new BackendApi({ sendRequest: Backbone.sync, buildSendRequestArguments });

```

## Using your own send mechanic
```js
import { BackendApi } from 'frontend-backend-api';

function mySendRequest(...sendRequestArguments) {
    // ....
}

function buildSendRequestArguments(options) {
    let sendRequestArguments = [ ... ];
    return sendRequestArguments;
}

export const customBackend = new BackendApi({ sendRequest: mySendRequest, buildSendRequestArguments });
```


1. What is the difference between Component and PureComponent? give an example where it might break my app

Basically PureComponent is normal Component but with a trick: it has `shouldComponentUpdate` already implemented to compare shallowly previous props and the next ones. If they are equal, the component won't re-render. This is useful when you have a lot of components and you want to avoid unnecessary re-renders. However, it's not a silver bullet. If you have a lot of props, it might be expensive to compare them all. Also, if you have a prop that is an object, it will compare the reference, not the cnotent

Regarding what it might break, well, I suppose, since it uses shallow comparison it might break if you have a prop that is an object and you mutate it. In this case, the reference will be the same, but the content will be diffferent.

2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

I'm not sure if I understand the question. I suppose it's because if you use context, you might have a lot of components that depend on it and if you use `shouldComponentUpdate` you might miss some of them and they won't re-render when the context changes. And also, as I've mentioned in the previous question, if you have a lot of props, it might be expensive to compare them all.

3. Describe 3 ways to pass information from a component to its PARENT.

That's a tricky question. Basically I can think of 2 main ways of passing data from child to parent: 
the first one is to simply use callbacks as props and pass them to children:

```js
const Parent = () => {
    const [data, setData] = useState(null)
    return <Child setData={setData} />
}

const Child = ({setData}) =>{
    return <input onChange={e => setData(e.target.value)}>Child</input>
}
```
the second one is to use react context:


```js
const Parent = () => {
    const [data, setData] = useState(null)
    return <Provider value={{data, setData}}><Child /></Provider>
}

const Child = () => {
    const {data, setData} = useContext(Context)
    return <input onChange={e => setData(e.target.value)}>Child</input>
}
```

as for the third way I don't really know if there is another way. Well, you can way that using state-management libraries is another way, but it's basically the same as using context. Some of the state management libraries use context under the hood and some using some custom solution but it's still the same.

Also, it's possible(throught not recommended) to use `window` object to pass data from child to parent, but it's not really a react way of doing things.

so lets the last one would either be using state-management library or using `window` object.

4. Give 2 ways to prevent components from re-rendering

Well, in class components there `shouldComponentUpdate` which is a method that allows you to stop rerendering on some conditions. It gets `prevProps` and `nextProps` as arguments and you can compare them and return `false` if you don't want to rerender. 

In functional components there is `React.memo` which is basically the same as `shouldComponentUpdate` but it's a HOC. It accepts a component and returns a component that will be re-rendered only if props change. It also accepts a second argument which is a function that compares previous props and next props. It's useful when you have a lot of props and you want to compare them shallowly. 

Also, it's possible to use `useMemo` hook to memoize some values and `useCallback` to memoize callbacks and prevent re-rendering.

5. What is a fragment and why do we need it? Give an example where it might
   break my app

Fragment is how we can return multiple elements/components from a component. It helps us to avoid unnecessary divs. It's useful when you have a component that returns multiple elements and you don't want to wrap them in a div. For example:

```js
const Component =() => {
    return (
        <>
            <div>1</div>
            <div>2</div>
        </>
    )
}
```

To be honest, I'm not sure how it might break the app. I suppose, if you use it in a wrong way, it might break the layout. Or if you forget to use keys (for which you should use `React.Fragment` syntax instead of `<>`)

6. Give 3 examples of the HOC pattern.

basically HOC (higher order component) is a design pattern that allows to reuse some logic. To be honest, nowadays I'm mostly using hooks for the same purpose, but I can think of 3 examples of HOCs:
    
- `withRouter` from `react-router-dom` - it's a HOC that gives you access to `history`, `location` and etc props. It's useful when you need to access them in a component that is not a direct child of `Route` component.
- any kind of logger for the application: you can create a HOC that will log all the props and state of the component and wrap all the components that you want to log.
- any logic around authorization: you can create a HOC that will check if the user is authorized and if not, redirect him to the login page. And then wrap all the components that you want to be protected.

basic HOC looks like this:
```js
const withLogger = Component => {
    return props => {
        console.log(props)
        return <Component {...props} />
    }
}
```

you can even use Class components sometimes for them:

```js
const withLogger = (WrappedComponent) => {
  return class WithLogger extends React.Component {
    componentDidUpdate(prevProps, prevState) {
      console.log('Previous props:', prevProps);
      console.log('Current props:', this.props);
      console.log('Previous state:', prevState);
      console.log('Current state:', this.state);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

7. what's the difference in handling exceptions in promises, callbacks and
   async...await.

callbacks: well, nowadays no one uses just pure callbacks but lets pretend we do:
it will look something like this:

```js
const getData = (callback) => {
    try {
        const data = doSomeStuffAsync('some url')
        callback(null, data)
    } catch (err) {
        callback(err)
    }
}
```

basically you have to pass a callback to the function and then call it with either error or data. It's not really convenient because you have to pass a callback every time you want to use this function. Also, it's not really convenient to handle errors because you have to check if the first argument is null or not.

promises: promises allows you to chain async functions in a flat manner. So like this:

```js
    const getData = () => {
        return doSomeStuffAsync('some url')
    }
    
    getData()
        .then(data => console.log(data))
        .catch(err => console.log(err))
```
here with `catch` we are able to catch an error. But its not all: the thing with catch is that since we are using it in chain, we can catch errors from all the functions in the chain OR we can actually have multiple `catch`es in the chain and catch errors from different functions in different places. So it's really convenient.

```js
getData()
  .then(data => console.log(data))
  .catch(err => console.log('error with loading'))
  .then(() => doSomeOtherStuffAsync())
  .catch(err => console.log('error with some other stuff'))
  .then(() => doSomeOtherStuffAsync())
  .catch(err => console.log('error with some other stuff 2'))
```

as for async...await it's basically combined matter from promises and callbacks. You use try...catch in a simular fashion trying to get an error through the async function.
```js
const getData = async () => {
    try {
        const data = await doSomeStuffAsync('some url')
        return data
    } catch (err) {
        console.log(err)
    }
}
```

8.  How many arguments does setState take and why is it async.

Again, kind of a tricky question. I assume we are talking about `setState` in class components and not about `useState` hook. If I remember correctly `setState` from class components actually accepts 2 arguments: first is a new state and second is a callback that will be called after the state is updated. This question, however, doesnt seem to be correct. I mean, it's not really async. (well with `setState` you CAN make it async in some way since you have 2nd argument, and even create a promisified version of setState if you want but it's not really the way it's supposed to be used).

I guess what you meant by this question is why does the state not changed immidiately after you use `setState`. And the reason for that is that react batches state updates. So if you call `setState` multiple times in a row, react will batch all the updates and then update the state. It's done for performance reasons


9.  List the steps needed to migrate a Class to Function Component.

Ok well lets try:
- You need to understand what happens in the class component. What are the lifecycle methods, what are the state variables, what are the props and how they are used.
- You also kind of need to understand what are the correlating hooks for the lifecycle methods. For example, if you have `componentDidMount` you need to use `useEffect` hook with empty array as a second argument. If you have `componentDidUpdate` you need to use `useEffect` hook with some variables as a second argument. If you have `componentWillUnmount` you need to return a function from `useEffect` hook. And so on.
- State works differently a bit in hooks vs class comps. While you can use a single state object in hooks, you should keep an eye on how does this state updates within the component. `setState` in class components merge the state object with the new state object that you provide as an argument to `setState`. In hooks, however, it's not the case. If you have a state object and you want to update it, you need to merge it yourself. lets assume we have a state:
```js
// class components:
state = {a: 1, b: 2}
//...//

setState({a: 2}) // this will only change a, while keeping the same b value

//functional components:
const [state, setState] = useState({a: 1, b: 2})
//...//
setState({a: 2}) // this will change a, but b will be undefined. you need to either merge it yourself or use multiple states
```
- Replace PureComponent with `React.memo` if needed
- Replace `this.props` with just `props`
- Replace `this.state` with just `state`
- Remove all this bindings from the constructor if needed
- Also make sure your class component not using ComponentDidCatch since it will make it impossible to migrate to FC/hooks. You can use ErrorBoundary component instead
- Move all of the subscriptions to `useEffect` hook with empty array as a second argument. Dont forget to unsubscribe in the return function

10. List a few ways styles can be used with components.

- inline styles with `style` prop
- global css files. You can import css files in your components and use them as you would use them in html
- css modules. You can import css files in your components and use them as you would use them in html. The difference is that css modules will generate unique class names for your classes so you can use them without worrying about name collisions
- any kind of css-in-js solutions. There are a lot of them. Styled components, emotion, etc. They all work in a simular fashion: you create a component and pass a css to it. It will generate a unique class name for your component and will inject the css into the head of the document. You can also pass props to your component and use them in your css. 

11. How to render an HTML string coming from the server.

well I suppose this question means that you have a client side application and want to get some html from the server and render it on the client. In this case you can use `dangerouslySetInnerHTML` prop. As you can imagine its not really recommended to use it since it's called dangerously for a reason. But if you really need to do it, you can do it like this:

```js

const html = '<div>some html</div>'
const Component = () => <div dangerouslySetInnerHTML={{__html: html}} />
```
/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_svelte' %> (and
// <%= stylesheet_pack_tag 'hello_svelte' %> if you have styles in your component)
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Svelte!</div> at the bottom of the page.

import Search from '../components/search.svelte'

const setup = () => {
  const element = document.querySelector('.search')
  if (element) {
    const search = new Search({
      target: element,
      props: {
        name: 'Svelte'
      }
    })

    window.search = search
  }
}

document.addEventListener('turbolinks:load', setup)
// document.addEventListener('turbolinks:render', setup)
document.addEventListener('turbolinks:before-render', () => {})

/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_svelte' %> (and
// <%= stylesheet_pack_tag 'hello_svelte' %> if you have styles in your component)
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Svelte!</div> at the bottom of the page.

import App from '../components/hikeEdit.svelte'
import { hike } from '../stores/hikeEditStore'

const setup = () => {
  const element = document.querySelector('.app')
  if (document.querySelector('.app')) {
    hike.set(window.PATH_DATA)
    const app = new App({
      target: element,
      props: {
        name: 'Svelte'
      }
    })

    window.app = app
  }
}

document.addEventListener('turbolinks:load', setup)
// document.addEventListener('turbolinks:render', setup)
document.addEventListener('turbolinks:before-render', () => {})
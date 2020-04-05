Rails.application.routes.draw do
  resources :hike_annotations
  resources :hikes
  resources :search, :controller => :search

  root :to => 'search#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

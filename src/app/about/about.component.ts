import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'about',
    templateUrl: './about.component.html'
})

export class AboutComponent implements OnInit {
    private token = 'pk_test_dYhjICjvz6wNsbOdeBX8o5UK';
    public handler: any;
    public stripe = (<any>window).Stripe('pk_test_g6do5S237ekq10r65BnxO6S0');
    public elements: any = this.stripe.elements();
    ngOnInit() {
        this.handler = (<any>window).StripeCheckout.configure({
            key: this.token,
            locale: 'auto',
            token: function (token: any) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.7
                console.log(token);
            }
        });

        var style = {
            base: {
                color: '#32325d',
                lineHeight: '18px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        // Create an instance of the card Element.
        var card = this.elements.create('card', { style: style });

        // Add an instance of the card Element into the `card-element` <div>.
        card.mount('#card-element');

        // Handle real-time validation errors from the card Element.
        card.addEventListener('change', function (event: any) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        // Handle form submission.
        var form = document.getElementById('payment-form');
        const self = this;
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            self.stripe.createToken(card).then(function (result: any) {
                if (result.error) {
                    // Inform the user if there was an error.
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server.
                    self.stripeTokenHandler(result.token);
                }
            });
        });

    }

    stripeTokenHandler(token: any) {
        // Insert the token ID into the form so it gets submitted to the server
        var form = document.getElementById('payment-form');
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);
        // Submit the form
        form.click();
    }

    // checkout guide https://stripe.com/docs/checkout#integration-custom
    openCheckout() {

        this.handler.open({
            name: 'Demo Site', // The name of your company or website
            description: '2 widgets', // escription of the product/service being purchased
            amount: 2000, // The amount (in cents) that's shown to the user
            zipCode: false //Specify whether Checkout should validate the billing postal code(def false)
        });
    }

}

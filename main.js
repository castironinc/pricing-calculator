const { createApp } = Vue;

createApp({
  template: `
    <div style="margin: 30px auto" class="calculatorContainer">
        <div class="flex">
            <div class="left-side">
                <h2 style="font-size: 32px;">Administrative</h2>
                <p style="margin-bottom: 20px;">
                    This section is where we make sure you get paid for your time and talent. Just add your hourly rate, the amount of time it takes you to make the product you’re calculating the price of, and the profit margin you’d like to make (if you’re not sure what number to choose, 20% is a good starting point)
                </p>
                <div class="inputs">
                    <div>
                        <label for="laborTime" >Labor Time (Hours)</label>
                        <div class="input-icon-container">
                            <i class="fa-regular fa-clock input-icon"></i>
                            <input
                                class="input-with-icon"
                                name="laborTime"
                                type="number"
                                min="0"
                                placeholder="1"
                                v-model="inputs.laborTime"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="rate" >Hourly Rate ($)</label>
                        <div class="input-icon-container">
                            <i class="input-icon fa-regular fa-dollar-sign"></i>
                            <input
                                class="input-with-icon"
                                name="rate"
                                type="number"
                                min="0"
                                placeholder="20"
                                v-model="inputs.rate"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="margin" >Desired Profit Margin (%)</label>
                        <div class="input-icon-container">
                            <i class="input-icon fa-regular fa-percent"></i>
                            <input
                                class="input-with-icon"
                                name="margin"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="40"
                                v-model="inputs.margin"
                            />
                        </div>
                    </div>
                </div>
                <div class="ingredients-section-container">
                    <div>
                        <h2 style="font-size: 32px;">Ingredients</h2>
                        <p style="margin-bottom: 20px;">
                            Add each of your recipe’s ingredients to calculate the cost to make your products. We recommend that you base your quantities on your standard batch size. Want a quick ballpark for pricing? Use one of our pre-loaded ingredient lists
                        </p>
                        <select @change="selectRecipe" class="styledSelect">
                            <option value="null">Preloaded Recipes</option>
                            <option value="cake">Cake</option>
                            <option value="cookies">Cookies</option>
                        </select>
                    </div>
                    <div class="ingredients-table">
                        <table>
                            <tr>
                                <th class="table-first-line">Ingredient</th>
                                <th class="table-first-line">
                                    Total Purchase Price
                                </th>
                                <th class="table-first-line tooltip">
                                <span class="tooltiptext">Ingredient weight or volume, often listed on product packaging (such as pounds, gallons)</span>
                                Unit of Purchase <i class="fa-solid fa-circle-question"></i>
                                </th>
                                <th class="table-first-line tooltip">Quantity Purchased <i class="fa-solid fa-circle-question"></i>
                                <span class="tooltiptext">Amount of ingredient in the main package</span></th>
                                <th class="table-first-line tooltip">Unit of Use <i class="fa-solid fa-circle-question"></i>
                                <span class="tooltiptext">Measurement used in recipe (such as cups or teaspoons)</span></th>
                                <th class="table-first-line tooltip">Units Used <i class="fa-solid fa-circle-question"></i><span class="tooltiptext">Amount of ingredient used in your recipe (2 cups, 3 tsp)</span></th>
                            </tr>
                            <tr v-for="(ingredient, i) in ingredients" :key="i">
                                <th>
                                    <i
                                        class="fa fa-times-circle"
                                        @click="removeIngredient(i)"
                                    ></i>
                                    {{ ingredient.name }}
                                </th>
                                <th>{{ ingredient.totalPrice }}</th>
                                <th>{{ ingredient.purchaseUnit }}</th>
                                <th>{{ ingredient.purchaseQuantity }}</th>
                                <th>{{ ingredient.useUnit }}</th>
                                <th>{{ ingredient.recipeQuantity }}</th>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="flex-buttons">
                    <button
                        class="btn-black"
                        @click="showAddIngredientModal = true"
                        style="margin-right: 0"
                    >
                        Add Ingredient
                    </button>
                    <button class="btn-orange" @click="calculate" style="margin-right: 0">
                        Calculate Now
                    </button>
                    <button
                        class="btn-black btn-outlined"
                        v-show="calculated"
                        @click="print"
                        style="margin-right: 0"
                    >
                        Print
                    </button>
                </div>
            </div>
            <div class="right-side">
                <div class="card">
                    <div class="card-top">
                        <div class="margin-label">
                            {{ inputs.margin }}% Profit Margin
                        </div>
                        <div style="font-size: 20px">Suggested Pricing</div>
                        <div class="suggested-price">
                        &#36;{{ results.suggestedPricing }}
                        </div>
                    </div>
                    <div class="card-bottom">
                        <div class="one">Profit Per Sale</div>
                        <div class="two">
                        &#36;{{ formatNumber(results.profitPerSale) }}
                        </div>
                        <div class="three">Cost of Labor</div>
                        <div class="four">
                        &#36;{{ formatNumber(results.costOfLabor) }}
                        </div>
                        <div class="five">Cost of Ingredients</div>
                        <div class="six">
                        &#36;{{ formatNumber(results.costOfIngredients) }}
                        </div>
                        <div class="seven">Total Cost</div>
                        <div class="eight">
                        &#36;{{ formatNumber(results.totalCost) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <form
            @submit.prevent="addIngredient"
            class="addIngredients"
            v-show="showAddIngredientModal"
        >
            <i
                class="close-ingredients-modal fa fa-times-circle"
                @click="showAddIngredientModal = false"
            ></i>
            <h2 style="margin:auto; font-size: 24px;">Add Ingredient</h2>
            <label for="name">Ingredient Name</label>
            <input type="text" v-model="newIngredient.name" required />
            <label for="">Total Purchase Price ($)</label>
            <input
                type="number"
                min="0"
                step="any"
                v-model="newIngredient.totalPrice"
                required
            />
            <label for="unit" class="tooltip">
            Purchase Unit  <i class="fa-solid fa-circle-question"></i>
            <span class="tooltiptext">Measurement used to purchase ingredient (such as pounds, gallons)</span>
          </label>
          <select
              name="unit"
              id="unit"
              v-model="newIngredient.purchaseUnit"
              required
          >
              <option value="Teaspoons">Teaspoons</option>
              <option value="Tablespoons">Tablespoons</option>
              <option value="Fluid Ounces">Fluid Ounces</option>
              <option value="Cups">Cups</option>
              <option value="Pints">Pints</option>
              <option value="Quarts">Quarts</option>
              <option value="Gallons">Gallons</option>
              <option value="Pieces">Pieces</option>
              <option value="Ounces">Ounces</option>
              <option value="Pounds">Pounds</option>
          </select>
          <label for="" class="tooltip">
            Purchase Quantity <i class="fa-solid fa-circle-question"></i>
            <span class="tooltiptext">Amount of ingredient in the main package</span>
          </label>
          <input
              type="number"
              min="0"
              step="any"
              v-model="newIngredient.purchaseQuantity"
              required
          />
          <label for="unit" class="tooltip">
            Unit of Use <i class="fa-solid fa-circle-question"></i>
            <span class="tooltiptext">Measurement used in recipe (such as cups or teaspoons)</span>
          </label>
          <select
              name="unit"
              id="unit"
              v-model="newIngredient.useUnit"
              required
          >
              <option value="Teaspoons">Teaspoons</option>
              <option value="Tablespoons">Tablespoons</option>
              <option value="Fluid Ounces">Fluid Ounces</option>
              <option value="Cups">Cups</option>
              <option value="Pints">Pints</option>
              <option value="Quarts">Quarts</option>
              <option value="Gallons">Gallons</option>
              <option value="Pieces">Pieces</option>
              <option value="Ounces">Ounces</option>
              <option value="Pounds">Pounds</option>
          </select>
          <label for="" class="tooltip">
            Units Used <i class="fa-solid fa-circle-question"></i>
            <span class="tooltiptext">Amount of ingredient used in recipe</span>
          </label>
            <input
                type="number"
                min="0"
                step="any"
                v-model="newIngredient.recipeQuantity"
                required
            />
            <input
                class="input-btn"
                type="submit"
                value="Add"
                style="margin: auto"
            />
        </form>
    </div>
    `,
  data() {
    return {
      ingredients: [],
      calculated: false,
      showAddIngredientModal: false,
      inputs: {
        laborTime: null,
        rate: null,
        margin: null
      },
      results: {
        suggestedPricing: 0,
        profitPerSale: 0,
        costOfLabor: 0,
        costOfIngredients: 0,
        totalCost: 0
      },
      newIngredient: {
        name: null,
        totalPrice: null,
        purchaseQuantity: null,
        purchaseUnit: null,
        useUnit: null,
        recipeQuantity: null
      }
    };
  },
  methods: {
    calculate() {
      this.results.costOfLabor = this.inputs.laborTime * this.inputs.rate;
      let costOfIngredients = 0;
      this.ingredients.forEach((ingredient) => {
        costOfIngredients =
          costOfIngredients + // Accumulated cost
          (ingredient.totalPrice /
          ingredient.purchaseQuantity / // Cost per purchase unit
            this.getConversionRate(
              ingredient.name,
              ingredient.purchaseUnit,
              ingredient.useUnit
            )) * // Conversion rate
            ingredient.recipeQuantity; // Recipe quantity
      });
      this.results.costOfIngredients = costOfIngredients;
      this.results.totalCost = this.results.costOfLabor + costOfIngredients;
      this.results.suggestedPricing = this.formatPrice(
        this.results.totalCost * (1 + this.inputs.margin / 100)
      );
      this.results.profitPerSale =
        this.results.suggestedPricing - this.results.totalCost;
      this.calculated = true;
    },
    addIngredient() {
      this.showAddIngredientModal = false;
      this.ingredients.push(this.newIngredient);
      this.newIngredient = {
        name: null,
        totalPrice: null,
        purchaseQuantity: null,
        purchaseUnit: null,
        useUnit: null,
        recipeQuantity: null
      };
    },
    removeIngredient(i) {
      this.ingredients.splice(i, 1);
    },
    formatPrice(price) {
      return Math.round((Math.ceil(price * 2) / 2) * 2) / 2 - 0.01;
    },
    formatNumber(number) {
      if (isNaN(number) || number === null) return "-";
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
      }).format(number);
    },
    getConversionRate(name, purchaseUnit, useUnit) {
      // Units of measurement
      if (purchaseUnit === useUnit) return 1;
      if (
        name.toLowerCase() === "flour" &&
        purchaseUnit === "Pounds" &&
        useUnit === "Cups"
      )
        return 3.6;
      if (
        name.toLowerCase() === "sugar" &&
        purchaseUnit === "Pounds" &&
        useUnit === "Cups"
      )
        return 2.27;
      if (
        name.toLowerCase() === "baking powder" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Teaspoons"
      )
        return 6.16;
      if (
        name.toLowerCase() === "salt" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Teaspoons"
      )
        return 4.98;
      if (
        name.toLowerCase() === "butter" &&
        purchaseUnit === "Pounds" &&
        useUnit === "Cups"
      )
        return 2;
      if (
        name.toLowerCase() === "oil" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Tablespoons"
      )
        return 2.1;
      if (
        name.toLowerCase() === "almond extract" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Teaspoons"
      )
        return 6.75;
      if (
        name.toLowerCase() === "vanilla extract" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Teaspoons"
      )
        return 6.75;
      if (
        name.toLowerCase() === "powdered sugar" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Cups"
      )
        return 0.23;
      if (
        name.toLowerCase() === "whipping cream" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Tablespoons"
      )
        return 1.89;
      if (
        name.toLowerCase() === "brown sugar" &&
        purchaseUnit === "Ounces" &&
        useUnit === "Cups"
      )
        return 0.14;
      if (purchaseUnit === "Teaspoons" && useUnit === "Tablespoons")
        return 0.3333333333333333;
      if (purchaseUnit === "Teaspoons" && useUnit === "Fluid Ounces")
        return 0.16666666666666666;
      if (purchaseUnit === "Teaspoons" && useUnit === "Cups")
        return 0.020833333333333332;
      if (purchaseUnit === "Teaspoons" && useUnit === "Pints")
        return 0.010416666666666666;
      if (purchaseUnit === "Teaspoons" && useUnit === "Quarts")
        return 0.005208333333333333;
      if (purchaseUnit === "Teaspoons" && useUnit === "Gallons")
        return 0.0013020833333333334;
      if (purchaseUnit === "Teaspoons" && useUnit === "Pieces")
        return 0.3333333333333333;
      if (purchaseUnit === "Teaspoons" && useUnit === "Ounces")
        return 0.16666666666666666;
      if (purchaseUnit === "Teaspoons" && useUnit === "Pounds")
        return 0.010416666666666666;
      if (purchaseUnit === "Tablespoons" && useUnit === "Teaspoons") return 3;
      if (purchaseUnit === "Tablespoons" && useUnit === "Fluid Ounces")
        return 0.5;
      if (purchaseUnit === "Tablespoons" && useUnit === "Cups") return 0.0625;
      if (purchaseUnit === "Tablespoons" && useUnit === "Pints") return 0.03125;
      if (purchaseUnit === "Tablespoons" && useUnit === "Quarts")
        return 0.015625;
      if (purchaseUnit === "Tablespoons" && useUnit === "Gallons")
        return 0.00390625;
      if (purchaseUnit === "Tablespoons" && useUnit === "Pieces") return 1;
      if (purchaseUnit === "Tablespoons" && useUnit === "Ounces") return 0.5;
      if (purchaseUnit === "Tablespoons" && useUnit === "Pounds")
        return 0.03125;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Teaspoons") return 6;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Tablespoons")
        return 2;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Cups") return 0.125;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Pints") return 0.0625;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Quarts")
        return 0.03125;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Gallons")
        return 0.0078125;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Pieces") return 2;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Ounces") return 1;
      if (purchaseUnit === "Fluid Ounces" && useUnit === "Pounds")
        return 0.0625;
      if (purchaseUnit === "Cups" && useUnit === "Teaspoons") return 48;
      if (purchaseUnit === "Cups" && useUnit === "Tablespoons") return 16;
      if (purchaseUnit === "Cups" && useUnit === "Fluid Ounces") return 8;
      if (purchaseUnit === "Cups" && useUnit === "Pints") return 0.5;
      if (purchaseUnit === "Cups" && useUnit === "Quarts") return 0.25;
      if (purchaseUnit === "Cups" && useUnit === "Gallons") return 0.0625;
      if (purchaseUnit === "Cups" && useUnit === "Pieces") return 16;
      if (purchaseUnit === "Cups" && useUnit === "Ounces") return 8;
      if (purchaseUnit === "Cups" && useUnit === "Pounds") return 0.5;
      if (purchaseUnit === "Pints" && useUnit === "Teaspoons") return 96;
      if (purchaseUnit === "Pints" && useUnit === "Tablespoons") return 32;
      if (purchaseUnit === "Pints" && useUnit === "Fluid Ounces") return 16;
      if (purchaseUnit === "Pints" && useUnit === "Cups") return 2;
      if (purchaseUnit === "Pints" && useUnit === "Quarts") return 0.5;
      if (purchaseUnit === "Pints" && useUnit === "Gallons") return 0.125;
      if (purchaseUnit === "Pints" && useUnit === "Pieces") return 32;
      if (purchaseUnit === "Pints" && useUnit === "Ounces") return 16;
      if (purchaseUnit === "Pints" && useUnit === "Pounds") return 1;
      if (purchaseUnit === "Quarts" && useUnit === "Teaspoons") return 192;
      if (purchaseUnit === "Quarts" && useUnit === "Tablespoons") return 64;
      if (purchaseUnit === "Quarts" && useUnit === "Fluid Ounces") return 32;
      if (purchaseUnit === "Quarts" && useUnit === "Cups") return 4;
      if (purchaseUnit === "Quarts" && useUnit === "Pints") return 2;
      if (purchaseUnit === "Quarts" && useUnit === "Gallons") return 0.25;
      if (purchaseUnit === "Quarts" && useUnit === "Pieces") return 64;
      if (purchaseUnit === "Quarts" && useUnit === "Ounces") return 32;
      if (purchaseUnit === "Quarts" && useUnit === "Pounds") return 2;
      if (purchaseUnit === "Gallons" && useUnit === "Teaspoons") return 768;
      if (purchaseUnit === "Gallons" && useUnit === "Tablespoons") return 256;
      if (purchaseUnit === "Gallons" && useUnit === "Fluid Ounces") return 128;
      if (purchaseUnit === "Gallons" && useUnit === "Cups") return 16;
      if (purchaseUnit === "Gallons" && useUnit === "Pints") return 8;
      if (purchaseUnit === "Gallons" && useUnit === "Quarts") return 4;
      if (purchaseUnit === "Gallons" && useUnit === "Pieces") return 256;
      if (purchaseUnit === "Gallons" && useUnit === "Ounces") return 128;
      if (purchaseUnit === "Gallons" && useUnit === "Pounds") return 8;
      if (purchaseUnit === "Pieces" && useUnit === "Teaspoons") return 1;
      if (purchaseUnit === "Pieces" && useUnit === "Tablespoons")
        return 0.3333333333333333;
      if (purchaseUnit === "Pieces" && useUnit === "Fluid Ounces") return 0.5;
      if (purchaseUnit === "Pieces" && useUnit === "Cups") return 0.0625;
      if (purchaseUnit === "Pieces" && useUnit === "Pints") return 0.03125;
      if (purchaseUnit === "Pieces" && useUnit === "Quarts") return 0.015625;
      if (purchaseUnit === "Pieces" && useUnit === "Gallons") return 0.00390625;
      if (purchaseUnit === "Pieces" && useUnit === "Ounces") return 0.0625;
      if (purchaseUnit === "Pieces" && useUnit === "Pounds") return 0.00390625;
      if (purchaseUnit === "Ounces" && useUnit === "Teaspoons") return 6;
      if (purchaseUnit === "Ounces" && useUnit === "Tablespoons") return 2;
      if (purchaseUnit === "Ounces" && useUnit === "Fluid Ounces") return 1;
      if (purchaseUnit === "Ounces" && useUnit === "Cups") return 0.125;
      if (purchaseUnit === "Ounces" && useUnit === "Pints") return 0.0625;
      if (purchaseUnit === "Ounces" && useUnit === "Quarts") return 0.03125;
      if (purchaseUnit === "Ounces" && useUnit === "Gallons") return 0.0078125;
      if (purchaseUnit === "Ounces" && useUnit === "Pieces") return 16;
      if (purchaseUnit === "Ounces" && useUnit === "Pounds") return 0.0625;
      if (purchaseUnit === "Pounds" && useUnit === "Teaspoons") return 192;
      if (purchaseUnit === "Pounds" && useUnit === "Tablespoons") return 64;
      if (purchaseUnit === "Pounds" && useUnit === "Fluid Ounces") return 32;
      if (purchaseUnit === "Pounds" && useUnit === "Cups") return 4;
      if (purchaseUnit === "Pounds" && useUnit === "Pints") return 2;
      if (purchaseUnit === "Pounds" && useUnit === "Quarts") return 1;
      if (purchaseUnit === "Pounds" && useUnit === "Gallons") return 0.25;
      if (purchaseUnit === "Pounds" && useUnit === "Pieces") return 256;
      if (purchaseUnit === "Pounds" && useUnit === "Ounces") return 16;
    },
    print() {
      window.print();
    },
    selectRecipe(e) {
      const recipe = e.target.value;
      switch (recipe) {
        case "cake":
          this.ingredients = [
            {
              name: "Flour",
              totalPrice: 4.19,
              purchaseQuantity: 5,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 3
            },
            {
              name: "Sugar",
              totalPrice: 2.79,
              purchaseQuantity: 4,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 3
            },
            {
              name: "Baking Powder",
              totalPrice: 1.89,
              purchaseQuantity: 8.1,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 2.5
            },
            {
              name: "Salt",
              totalPrice: 1.39,
              purchaseQuantity: 26,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 1
            },
            {
              name: "Butter",
              totalPrice: 4.19,
              purchaseQuantity: 1,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 3
            },
            {
              name: "Egg Whites",
              totalPrice: 2.49,
              purchaseQuantity: 12,
              purchaseUnit: "Pieces",
              useUnit: "Pieces",
              recipeQuantity: 7
            },
            {
              name: "Sour Cream",
              totalPrice: 2.19,
              purchaseQuantity: 16,
              purchaseUnit: "Ounces",
              useUnit: "Cups",
              recipeQuantity: 1.5
            },
            {
              name: "Oil",
              totalPrice: 3.79,
              purchaseQuantity: 48,
              purchaseUnit: "Ounces",
              useUnit: "Tablespoons",
              recipeQuantity: 2
            },
            {
              name: "Almond Extract",
              totalPrice: 4.99,
              purchaseQuantity: 2,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 1
            },
            {
              name: "Vanilla Extract",
              totalPrice: 7.99,
              purchaseQuantity: 2,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 1
            },
            {
              name: "Powdered Sugar",
              totalPrice: 1.89,
              purchaseQuantity: 32,
              purchaseUnit: "Ounces",
              useUnit: "Cups",
              recipeQuantity: 7
            },
            {
              name: "Whipping Cream",
              totalPrice: 2.69,
              purchaseQuantity: 16,
              purchaseUnit: "Ounces",
              useUnit: "Tablespoons",
              recipeQuantity: 3
            }
          ];
          break;
        case "cookies":
          this.ingredients = [
            {
              name: "Unsalted Butter",
              totalPrice: 2.49,
              purchaseQuantity: 1,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 1
            },
            {
              name: "Light Brown Sugar",
              totalPrice: 1.89,
              purchaseQuantity: 32,
              purchaseUnit: "Ounces",
              useUnit: "Cups",
              recipeQuantity: 1
            },
            {
              name: "Granulated White Sugar",
              totalPrice: 2.79,
              purchaseQuantity: 4,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 0.5
            },
            {
              name: "Eggs",
              totalPrice: 2.49,
              purchaseQuantity: 12,
              purchaseUnit: "Pieces",
              useUnit: "Pieces",
              recipeQuantity: 2
            },
            {
              name: "Vanilla",
              totalPrice: 7.99,
              purchaseQuantity: 2,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 2
            },
            {
              name: "Salt",
              totalPrice: 1.39,
              purchaseQuantity: 26,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 0.75
            },
            {
              name: "Baking Powder",
              totalPrice: 1.89,
              purchaseQuantity: 8.1,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 0.25
            },
            {
              name: "Flour",
              totalPrice: 4.19,
              purchaseQuantity: 5,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 4
            }
          ];
          break;
        case "linsday":
          this.ingredients = [
            {
              name: "Flour",
              totalPrice: 4.19,
              purchaseQuantity: 5,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 3
            },
            {
              name: "Sugar",
              totalPrice: 2.79,
              purchaseQuantity: 4,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 3
            },
            {
              name: "Baking Powder",
              totalPrice: 1.89,
              purchaseQuantity: 8.1,
              purchaseUnit: "Ounces",
              useUnit: "Tablespoons",
              recipeQuantity: 2.5
            },
            {
              name: "Salt",
              totalPrice: 1.39,
              purchaseQuantity: 26,
              purchaseUnit: "Ounces",
              useUnit: "Teaspoons",
              recipeQuantity: 1
            },
            {
              name: "Butter",
              totalPrice: 4.19,
              purchaseQuantity: 1,
              purchaseUnit: "Pounds",
              useUnit: "Cups",
              recipeQuantity: 3
            },
            {
              name: "Egg Whites",
              totalPrice: 2.49,
              purchaseQuantity: 12,
              purchaseUnit: "Pieces",
              useUnit: "Pieces",
              recipeQuantity: 7
            },
            {
              name: "Sour Cream",
              totalPrice: 2.19,
              purchaseQuantity: 16,
              purchaseUnit: "Ounces",
              useUnit: "Cups",
              recipeQuantity: 1.5
            },
            {
              name: "Oil",
              totalPrice: 3.79,
              purchaseQuantity: 48,
              purchaseUnit: "Fluid Ounces",
              useUnit: "Tablespoons",
              recipeQuantity: 2
            },
            {
              name: "Almond Extract",
              totalPrice: 4.99,
              purchaseQuantity: 2,
              purchaseUnit: "Fluid Ounces",
              useUnit: "Tablespoons",
              recipeQuantity: 1
            },
            {
              name: "Vanilla Extract",
              totalPrice: 7.99,
              purchaseQuantity: 2,
              purchaseUnit: "Fluid Ounces",
              useUnit: "Tablespoons",
              recipeQuantity: 1
            },
            {
              name: "Powdered Sugar",
              totalPrice: 1.89,
              purchaseQuantity: 32,
              purchaseUnit: "Ounces",
              useUnit: "Cups",
              recipeQuantity: 7
            },
            {
              name: "Whipping Cream",
              totalPrice: 2.69,
              purchaseQuantity: 2,
              purchaseUnit: "Cups",
              useUnit: "Tablespoons",
              recipeQuantity: 3
            }
          ];
          break;
        default:
          this.ingredients = [];
          break;
      }
    }
  },
  filters: {
    formatNumber: function (number) {
      if (isNaN(number) | (number === null)) return "-";
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
      }).format(number);
    }
  }
}).mount("#vueCalculator");

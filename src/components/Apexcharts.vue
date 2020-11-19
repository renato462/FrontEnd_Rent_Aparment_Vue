<template>
  <div>
    <v-card class="mx-auto text-center" color="" max-width="100%" height="50%">
      <v-card-text>
        <v-sheet>
          <apexcharts
            width="100%"
            height="500"
            :options="options"
            :series="series"
          ></apexcharts>
        </v-sheet>
      </v-card-text>

      <v-card-text>
        <div class="display-1 font-weight-thin">Sales Last 24h</div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-center">
        <v-btn block text> Go to Report </v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mt-4 mx-auto" max-width="400">
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="cyan"
        elevation="100"
        max-width="calc(100% - 32px)"
      >
        <apexcharts
          width="100%"
          :options="options"
          :series="series"
        ></apexcharts>
      </v-sheet>

      <v-card-text class="pt-4">
        <div class="title font-weight-light mb-2">User Registrations</div>
        <div class="subheading font-weight-light grey--text">
          Last Campaign Performance
        </div>
        <v-divider class="my-2"></v-divider>
        <v-icon class="mr-2" small> mdi-clock </v-icon>
        <span class="caption grey--text font-weight-light"
          >last registration 26 minutes ago</span
        >
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Apexcharts",
  components: {
    apexcharts: VueApexCharts,
  },
  data: () => ({
    options: {
      chart: {
        id: "vuechart-example",
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: ["smooth", "straight", "stepline"],
        dashArray: [0, 8, 5],
      },
      xaxis: {
        categories: [
          "1WK",
          "2 WK",
          "3 WK",
          "4 WK",
          "5 WK",
          "6 WK",
          "7 WK",
          "8 WK",
          "9 WK",
          "10 WK",
          "11 WK",
          "12 WK",
          "13 WK",
          "14 WK",
          "15 WK",
          "16 WK",
          "17 WK",
          "18 WK",
          "19 WK",
          "20 WK",
          "21 WK",
          "22 WK",
          "23 WK",
          "24 WK",
          "25 WK",
          "26 WK",
          "27 WK",
          "28 WK",
          "29 WK",
          "30 WK",
          "31 WK",
          "32 WK",
          "33 WK",
          "34 WK",
          "35 WK",
          "36 WK",
          "37 WK",
          "38 WK",
          "39 WK",
          "40 WK",
          "41 WK",
          "42 WK",
          "43 WK",
          "44 WK",
          "45 WK",
          "46 WK",
          "47 WK",
          "48 WK",
          "49 WK",
          "50 WK",
          "51 WK",
          "52 WK",
        ],
      },
    },
    series: [
      {
        name: "series-1",
        type: "column",
        data: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          40,
          39,
          38,
          37,
          36,
          35,
          34,
          33,
          32,
          31,
          30,
          29,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          ,
          ,
          122,
          123,
          124,
          125,
          126,
          127,
          128,
        ],
      },
      {
        name: "series-2",
        data: [
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
          51,
          52,
          53,
          54,
        ],
      },
      {
        name: "series-3",
        data: [
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
          51,
          52,
          53,
          54,
        ],
      },
    ],

    // options: {
    //   chart: {
    //     height: 350,
    //     type: "line",
    //     dropShadow: {
    //       enabled: true,
    //       color: "#000",
    //       top: 18,
    //       left: 7,
    //       blur: 10,
    //       opacity: 0.2,
    //     },
    //     toolbar: {
    //       show: false,
    //     },
    //   },
    //   colors: ["green", "#545454"],
    //   dataLabels: {
    //     enabled: true,
    //   },
    //   stroke: {
    //     curve: ['smooth', 'straight', 'stepline'],
    //     dashArray: [0, 8, 5]
    //   },
    //   title: {
    //     text: "Average High & Low Temperature",
    //     align: "left",
    //   },
    //   grid: {
    //     borderColor: "#e7e7e7",
    //     row: {
    //       colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
    //       opacity: 0.5,
    //     },
    //   },
    //   markers: {
    //     size: 1,
    //   },
    //   xaxis: {
    //     categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    //     title: {
    //       text: "Month",
    //     },
    //   },
    //   yaxis: {
    //     title: {
    //       text: "Temperature",
    //     },
    //     min: 0,
    //     max: 40,
    //   },
    //   legend: {
    //     position: "top",
    //     horizontalAlign: "right",
    //     floating: true,
    //     offsetY: -25,
    //     offsetX: -5,
    //   },
    // },
    // series: [
    //   {
    //     name: "High - 2013",
    //     data: [28, 29, 33, 36, 32, 32, 33],
    //   },
    //   {
    //     name: "Low - 2013",
    //     data: [12, 11, 14, 18, 17, 13, 13],
    //   },
    // ],
  }),
  computed: {},

  created() {},
  methods: {},
};
</script>

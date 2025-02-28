import {Component, inject, Input, OnDestroy, SimpleChanges} from '@angular/core';
import {Params} from '@angular/router';
import {Store} from '@ngrx/store';
import {Node} from 'org_xprof/frontend/app/common/interfaces/op_profile.jsonpb_decls';
import {type OpProfileProto} from 'org_xprof/frontend/app/common/interfaces/data_table';
import {NavigationEvent} from 'org_xprof/frontend/app/common/interfaces/navigation_event';
import {DATA_SERVICE_INTERFACE_TOKEN} from 'org_xprof/frontend/app/services/data_service_v2/data_service_v2_interface';
import {setCurrentToolStateAction, setOpProfileRootNodeAction} from 'org_xprof/frontend/app/store/actions';
import {ReplaySubject} from 'rxjs';

import {OpProfileData, OpProfileSummary} from './op_profile_data';

/** Base class of Op Profile component. */
@Component({
  standalone: false,
  selector: 'op-profile-base',
  templateUrl: './op_profile_base.ng.html',
  styleUrls: ['./op_profile_common.scss']
})
export class OpProfileBase implements OnDestroy {
  /** Handles on-destroy Subject, used to unsubscribe. */
  private readonly destroyed = new ReplaySubject<void>(1);
  private readonly dataService = inject(DATA_SERVICE_INTERFACE_TOKEN);
  profile: OpProfileProto|null = null;
  rootNode?: Node;
  data = new OpProfileData();
  hasMultiModules = false;
  isByCategory = false;
  excludeIdle = true;
  byWasted = false;
  showP90 = false;
  childrenCount = 10;
  deviceType = 'TPU';
  summary: OpProfileSummary[] = [];

  @Input() opProfileData: OpProfileProto|null = null;

  processQuery(params: Params) {}
  update(event: NavigationEvent) {}
  parseData(data: OpProfileProto|null) {
    this.profile = data;
    this.hasMultiModules =
        !!this.profile && !!this.profile.byCategory && !!this.profile.byProgram;
    this.isByCategory = false;
    this.updateRoot();
    this.data.update(this.rootNode);
    this.summary = this.dataService.getOpProfileSummary(this.data);
  }

  constructor(
      private readonly store: Store<{}>,
  ) {
    this.store.dispatch(
        setCurrentToolStateAction({currentTool: 'hlo_op_profile'}),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['opProfileData'].previousValue === null &&
        changes['opProfileData'].currentValue !== null) {
      this.parseData(this.opProfileData);
    }
  }

  private updateRoot() {
    if (!this.profile) {
      this.rootNode = undefined;
      return;
    }

    if (this.excludeIdle) {
      if (!this.hasMultiModules) {
        this.rootNode = this.profile.byCategoryExcludeIdle ||
            this.profile.byProgramExcludeIdle;
      } else {
        this.rootNode = this.isByCategory ? this.profile.byCategoryExcludeIdle :
                                            this.profile.byProgramExcludeIdle;
      }
    } else {
      if (!this.hasMultiModules) {
        this.rootNode = this.profile.byCategory || this.profile.byProgram;
      } else {
        this.rootNode = this.isByCategory ? this.profile.byCategory :
                                            this.profile.byProgram;
      }
    }

    this.deviceType = this.profile.deviceType || 'TPU';
    this.store.dispatch(
        setOpProfileRootNodeAction({rootNode: this.rootNode}),
    );
  }

  updateChildrenCount(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    const rounded = Math.round(value / 10) * 10;

    this.childrenCount = Math.max(Math.min(rounded, 100), 10);
  }

  updateToggle() {
    this.isByCategory = !this.isByCategory;
    this.updateRoot();
  }

  updateExcludeIdle() {
    this.excludeIdle = !this.excludeIdle;
    this.updateRoot();
    this.data.update(this.rootNode);
  }

  updateByWasted() {
    this.byWasted = !this.byWasted;
  }

  updateShowP90() {
    this.showP90 = !this.showP90;
  }

  ngOnDestroy() {
    // Unsubscribes all pending subscriptions.
    this.store.dispatch(setOpProfileRootNodeAction({rootNode: undefined}));
    this.destroyed.next();
    this.destroyed.complete();
  }
}
